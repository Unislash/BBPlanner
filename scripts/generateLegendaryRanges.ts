/**
 * Pull named-item roll ranges from the Battle Brothers wiki and emit a local ranges artifact.
 *
 * Usage:
 * - Run `yarn generateLegendaryRanges`
 * - Review `output/generateLegendaryRanges.output.ts`
 * - Review `output/generateLegendaryRanges.report.json`
 */

import fs from "node:fs";
import https from "node:https";
import path from "node:path";
import mkdirp from "mkdirp";
import { allArchetypesById } from "../src/legendaryRating/data/archetypes";
import type {
    Archetype,
    ArchetypeId,
    LegendaryStatInputType,
    LegendaryStatType,
} from "../src/legendaryRating/types/models";

type RangePatch = Partial<Record<LegendaryStatType | LegendaryStatInputType, number>>;

const outputDirectory = path.resolve(__dirname, "../output");
const outputFile = path.join(outputDirectory, "generateLegendaryRanges.output.ts");
const reportFile = path.join(outputDirectory, "generateLegendaryRanges.report.json");
const archetypesFile = path.resolve(__dirname, "../src/legendaryRating/data/archetypes.ts");
const sourceUrl =
    "https://battlebrothers.fandom.com/api.php?action=parse&page=Named_and_Legendary_Items&prop=text&formatversion=2&format=json";

const aliasNameToArchetypeId: Partial<Record<string, ArchetypeId>> = {
    nosehornedhelmet: "norse_horned_helmet",
    reinforcedboondockbow: "bow_goblin",
};

const decodeHtml = (value: string) => {
    return value
        .replace(/&nbsp;|&#160;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#8722;|&minus;/g, "-")
        .replace(/&ndash;|&#8211;/g, "-");
};

const stripTags = (value: string) => {
    return decodeHtml(value)
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim();
};

const normalizeName = (value: string) => {
    return value
        .toLowerCase()
        .replace(/\bnamed\b/g, "")
        .replace(/[^a-z0-9]+/g, "");
};

const escapeRegExp = (value: string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const archetypeIdByNormalizedName = Object.values(allArchetypesById).reduce<Record<string, ArchetypeId>>(
    (accumulator, archetype) => {
        accumulator[normalizeName(archetype.name)] = archetype.id;
        return accumulator;
    },
    {},
);

const getRequestBody = (url: string) =>
    new Promise<string>((resolve, reject) => {
        https
            .get(url, (response) => {
                const chunks: Buffer[] = [];

                response.on("data", (chunk) => chunks.push(chunk));
                response.on("end", () => {
                    if (response.statusCode && response.statusCode >= 400) {
                        reject(new Error(`Request failed with status ${response.statusCode}`));
                        return;
                    }

                    resolve(Buffer.concat(chunks).toString("utf8"));
                });
            })
            .on("error", reject);
    });

const getHtmlRows = (html: string): string[] => {
    return html.match(/<tr[\s\S]*?<\/tr>/gi) || [];
};

const getRowCells = (rowHtml: string): string[] => {
    const matches = rowHtml.match(/<t[dh][^>]*>[\s\S]*?<\/t[dh]>/gi) || [];
    return matches.map((cellHtml) => stripTags(cellHtml));
};

const getRowMatch = (cells: string[]) => {
    let latestMatch:
        | {
              archetypeId: ArchetypeId;
              nameCellIndex: number;
          }
        | undefined;

    for (let index = 0; index < cells.length; index += 1) {
        const normalizedName = normalizeName(cells[index]);
        if (!normalizedName) {
            continue;
        }

        const matchedArchetypeId =
            aliasNameToArchetypeId[normalizedName] || archetypeIdByNormalizedName[normalizedName];
        if (matchedArchetypeId) {
            latestMatch = {
                archetypeId: matchedArchetypeId,
                nameCellIndex: index,
            };
        }
    }

    return latestMatch;
};

const parseRange = (value?: string) => {
    if (!value) {
        return undefined;
    }

    const numberMatches = value.replace(/−/g, "-").match(/-?\d+(?:\.\d+)?/g);
    if (!numberMatches || numberMatches.length === 0) {
        return undefined;
    }

    if (numberMatches.length === 1) {
        const parsedValue = Number(numberMatches[0]);
        return [parsedValue, parsedValue] as const;
    }

    return [Number(numberMatches[0]), Number(numberMatches[1])] as const;
};

const setRange = (target: RangePatch, minKey: LegendaryStatType, maxKey: LegendaryStatType, value: string) => {
    const range = parseRange(value);
    if (!range) {
        return;
    }

    target[minKey] = range[0];
    target[maxKey] = range[1];
};

const setDamageRange = (target: RangePatch, minimumDamageCell: string, maximumDamageCell: string) => {
    const minimumDamageRange = parseRange(minimumDamageCell);
    const maximumDamageRange = parseRange(maximumDamageCell);
    if (!minimumDamageRange || !maximumDamageRange) {
        return;
    }

    target.minimumDamageMin = minimumDamageRange[0];
    target.minimumDamageMax = maximumDamageRange[0];
    target.maximumDamageMin = minimumDamageRange[1];
    target.maximumDamageMax = maximumDamageRange[1];
};

const getStatCells = (cellsAfterName: string[]) => {
    const statCells = cellsAfterName.filter((cell) => parseRange(cell) !== undefined);
    return statCells.slice(0, -1);
};

const buildPatchForWeapon = (archetype: Archetype, statCells: string[]) => {
    const patch: RangePatch = {};
    let index = 0;

    if ("durabilityMin" in archetype && "durabilityMax" in archetype) {
        setRange(patch, "durabilityMin", "durabilityMax", statCells[index]);
        index += 1;
    }

    setDamageRange(patch, statCells[index], statCells[index + 1]);
    setRange(patch, "directDamageMin", "directDamageMax", statCells[index + 2]);
    setRange(patch, "armorDamageMin", "armorDamageMax", statCells[index + 3]);

    let optionalIndex = index + 4;
    if ("shieldDamageMin" in archetype && "shieldDamageMax" in archetype) {
        setRange(patch, "shieldDamageMin", "shieldDamageMax", statCells[optionalIndex]);
        optionalIndex += 1;
    }

    if ("hitHeadChanceMin" in archetype && "hitHeadChanceMax" in archetype) {
        setRange(patch, "hitHeadChanceMin", "hitHeadChanceMax", statCells[optionalIndex]);
        optionalIndex += 1;
    }

    setRange(patch, "fatigueMin", "fatigueMax", statCells[optionalIndex]);

    if ("fatigueSkillCostMin" in archetype && "fatigueSkillCostMax" in archetype) {
        patch.fatigueSkillCostMin = -1;
        patch.fatigueSkillCostMax = -3;
    }

    if ("accuracyMin" in archetype && "accuracyMax" in archetype) {
        patch.accuracyMin = 5;
        patch.accuracyMax = 15;
    }

    if ("ammoMin" in archetype && "ammoMax" in archetype) {
        patch.ammoMin = 1;
        patch.ammoMax = 3;
    }

    return patch;
};

const buildPatchForRangedWeapon = (archetype: Archetype, statCells: string[]) => {
    const patch: RangePatch = {};
    let index = 0;

    if ("durabilityMin" in archetype && "durabilityMax" in archetype) {
        setRange(patch, "durabilityMin", "durabilityMax", statCells[index]);
        index += 1;
    }

    setDamageRange(patch, statCells[index], statCells[index + 1]);
    setRange(patch, "directDamageMin", "directDamageMax", statCells[index + 2]);
    setRange(patch, "armorDamageMin", "armorDamageMax", statCells[index + 3]);

    let optionalIndex = index + 4;
    if ("hitHeadChanceMin" in archetype && "hitHeadChanceMax" in archetype) {
        setRange(patch, "hitHeadChanceMin", "hitHeadChanceMax", statCells[optionalIndex]);
        optionalIndex += 1;
    }

    setRange(patch, "fatigueMin", "fatigueMax", statCells[optionalIndex]);

    if ("fatigueSkillCostMin" in archetype && "fatigueSkillCostMax" in archetype) {
        patch.fatigueSkillCostMin = -1;
        patch.fatigueSkillCostMax = -3;
    }

    if ("accuracyMin" in archetype && "accuracyMax" in archetype) {
        patch.accuracyMin = 5;
        patch.accuracyMax = 15;
    }

    if ("ammoMin" in archetype && "ammoMax" in archetype) {
        patch.ammoMin = 1;
        patch.ammoMax = 3;
    }

    return patch;
};

const buildPatchForShield = (archetype: Archetype, statCells: string[]) => {
    const patch: RangePatch = {};
    setRange(patch, "durabilityMin", "durabilityMax", statCells[0]);
    setRange(patch, "meleeDefenseMin", "meleeDefenseMax", statCells[1]);
    setRange(patch, "rangedDefenseMin", "rangedDefenseMax", statCells[2]);
    setRange(patch, "fatigueMin", "fatigueMax", statCells[3]);

    if ("fatigueSkillCostMin" in archetype && "fatigueSkillCostMax" in archetype) {
        patch.fatigueSkillCostMin = -1;
        patch.fatigueSkillCostMax = -3;
    }

    return patch;
};

const buildPatchForArmor = (statCells: string[]) => {
    const patch: RangePatch = {};
    setRange(patch, "durabilityMin", "durabilityMax", statCells[0]);
    setRange(patch, "fatigueMin", "fatigueMax", statCells[1]);
    return patch;
};

const buildPatchForArchetype = (archetype: Archetype, cellsAfterName: string[]) => {
    const statCells = getStatCells(cellsAfterName);

    if ("meleeDefenseMin" in archetype && "rangedDefenseMin" in archetype) {
        return buildPatchForShield(archetype, statCells);
    }

    if ("accuracyMin" in archetype || "ammoMin" in archetype) {
        return buildPatchForRangedWeapon(archetype, statCells);
    }

    if ("minimumDamageMin" in archetype && "maximumDamageMin" in archetype) {
        return buildPatchForWeapon(archetype, statCells);
    }

    return buildPatchForArmor(statCells);
};

const comparePatchToCurrentData = (archetypeId: ArchetypeId, patch: RangePatch) => {
    const archetype = allArchetypesById[archetypeId] as unknown as Record<string, unknown>;
    return Object.entries(patch)
        .filter(([key, value]) => archetype[key] !== value)
        .map(([key, value]) => ({
            key,
            nextValue: value,
            previousValue: archetype[key],
        }));
};

const applyGeneratedRangesToSource = (source: string, generatedRanges: Partial<Record<ArchetypeId, RangePatch>>) => {
    let updatedSource = source;

    (Object.entries(generatedRanges) as [ArchetypeId, RangePatch][]).forEach(([archetypeId, patch]) => {
        const blockRegex = new RegExp(`('${escapeRegExp(archetypeId)}': \\{[\\s\\S]*?\\n\\s*\\},)`, "m");
        const matchedBlock = updatedSource.match(blockRegex);
        if (!matchedBlock) {
            throw new Error(`Could not find archetype block for ${archetypeId}`);
        }

        let updatedBlock = matchedBlock[1];

        Object.entries(patch).forEach(([key, value]) => {
            const propertyRegex = new RegExp(`(${escapeRegExp(key)}: )-?\\d+(?:\\.\\d+)?`);
            if (propertyRegex.test(updatedBlock)) {
                updatedBlock = updatedBlock.replace(propertyRegex, `$1${value}`);
            }
        });

        updatedSource = updatedSource.replace(matchedBlock[1], updatedBlock);
    });

    return updatedSource;
};

const main = async () => {
    const apiResponse = await getRequestBody(sourceUrl);
    const { parse } = JSON.parse(apiResponse) as { parse?: { text?: string } };
    if (!parse?.text) {
        throw new Error("Could not parse wiki response");
    }

    const generatedRanges = getHtmlRows(parse.text).reduce<Partial<Record<ArchetypeId, RangePatch>>>(
        (accumulator: Partial<Record<ArchetypeId, RangePatch>>, rowHtml: string) => {
            const cells = getRowCells(rowHtml);
            if (cells.length === 0) {
                return accumulator;
            }

            const rowMatch = getRowMatch(cells);
            if (!rowMatch) {
                return accumulator;
            }

            const archetype = allArchetypesById[rowMatch.archetypeId];
            const cellsAfterName = cells.slice(rowMatch.nameCellIndex + 1);
            accumulator[rowMatch.archetypeId] = buildPatchForArchetype(archetype, cellsAfterName);
            return accumulator;
        },
        {},
    );

    const matchedIds = new Set(Object.keys(generatedRanges));
    const unmatchedArchetypeIds = Object.keys(allArchetypesById).filter((archetypeId) => !matchedIds.has(archetypeId));

    const changedEntries = Object.entries(generatedRanges).flatMap(([archetypeId, patch]) => {
        return comparePatchToCurrentData(archetypeId as ArchetypeId, patch || {}).map((change) => ({
            archetypeId,
            ...change,
        }));
    });

    mkdirp.sync(outputDirectory);

    const archetypesSource = fs.readFileSync(archetypesFile, "utf8");
    const nextArchetypesSource = applyGeneratedRangesToSource(archetypesSource, generatedRanges);
    if (nextArchetypesSource !== archetypesSource) {
        fs.writeFileSync(archetypesFile, nextArchetypesSource);
    }

    fs.writeFileSync(
        outputFile,
        [
            `// Generated by scripts/generateLegendaryRanges.ts`,
            `// Source: ${sourceUrl}`,
            ``,
            `export const generatedLegendaryRanges = ${JSON.stringify(generatedRanges, null, 4)} as const;`,
            ``,
        ].join("\n"),
    );

    fs.writeFileSync(
        reportFile,
        JSON.stringify(
            {
                changedEntries,
                matchedArchetypeCount: matchedIds.size,
                unmatchedArchetypeIds,
            },
            null,
            4,
        ),
    );

    console.log(`Generated ${matchedIds.size} archetype range entries to ${outputFile}`);
    console.log(`Wrote sync report to ${reportFile}`);
    console.log(
        nextArchetypesSource !== archetypesSource
            ? `Updated ${archetypesFile}`
            : `${archetypesFile} already matched the generated ranges`,
    );
};

void main();
