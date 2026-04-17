import {
    allArchetypesById,
    armorArchetypes,
    helmetArchetypes,
    melee1hArchetypes,
    melee2hArchetypes,
    rangedArchetypes,
    shieldArchetypes,
} from "./data/archetypes";
import { getDefaultLegendaryStats } from "./components/Evaluator/appraisal";
import { legendaryStore } from "./stores/legendaryStore";
import type { ArchetypeId, CategoryId, LegendaryStatInputType } from "./types/models";

const statAliases: Record<LegendaryStatInputType, string> = {
    durability: "dur",
    fatigue: "fat",
    damageLow: "damL",
    damageHigh: "damH",
    directDamage: "dDam",
    armorDamage: "aDam",
    shieldDamage: "sDam",
    hitHeadChance: "hHead",
    meleeDefense: "mDef",
    rangedDefense: "rDef",
    fatigueSkillCost: "fatC",
    accuracy: "acc",
    ammo: "ammo",
};

const statKeysInOrder: LegendaryStatInputType[] = [
    "durability",
    "fatigue",
    "damageLow",
    "damageHigh",
    "directDamage",
    "armorDamage",
    "shieldDamage",
    "hitHeadChance",
    "meleeDefense",
    "rangedDefense",
    "fatigueSkillCost",
    "accuracy",
    "ammo",
];

const statKeysByAlias = Object.fromEntries(
    Object.entries(statAliases).map(([statKey, alias]) => [alias, statKey as LegendaryStatInputType]),
) as Record<string, LegendaryStatInputType>;

const categoryByArchetypeId = {
    ...Object.fromEntries(Object.keys(melee1hArchetypes).map((id) => [id, "oneHanded"])),
    ...Object.fromEntries(Object.keys(melee2hArchetypes).map((id) => [id, "twoHanded"])),
    ...Object.fromEntries(Object.keys(rangedArchetypes).map((id) => [id, "ranged"])),
    ...Object.fromEntries(Object.keys(shieldArchetypes).map((id) => [id, "shield"])),
    ...Object.fromEntries(Object.keys(helmetArchetypes).map((id) => [id, "helmet"])),
    ...Object.fromEntries(Object.keys(armorArchetypes).map((id) => [id, "armor"])),
} as Record<string, CategoryId>;

const isValidArchetypeId = (itemId: string | null): itemId is ArchetypeId => {
    return !!itemId && itemId in allArchetypesById;
};

export const getCategoryIdForArchetypeId = (archetypeId: ArchetypeId | null): CategoryId => {
    if (!archetypeId) {
        return "oneHanded";
    }

    return categoryByArchetypeId[archetypeId] || "oneHanded";
};

const getSerializedStats = (
    archetypeId: ArchetypeId,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
): string | null => {
    const defaultLegendaryStats = getDefaultLegendaryStats(allArchetypesById[archetypeId]);

    const serializedStats = statKeysInOrder.flatMap((statKey) => {
        const value = legendaryStats[statKey];
        const defaultValue = defaultLegendaryStats[statKey];

        if (value === undefined || defaultValue === undefined || value === defaultValue) {
            return [];
        }

        return [`${statAliases[statKey]}.${value}`];
    });

    return serializedStats.length ? serializedStats.join("_") : null;
};

export const saveLegendaryToURL = ({
    legendaryStats,
    selectedArchetypeId,
    shouldCreateHistoryEntry,
}: {
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>;
    selectedArchetypeId: ArchetypeId | null;
    shouldCreateHistoryEntry?: boolean;
}) => {
    const params = new URLSearchParams();

    if (selectedArchetypeId) {
        params.set("item", selectedArchetypeId);

        const serializedStats = getSerializedStats(selectedArchetypeId, legendaryStats);
        if (serializedStats) {
            params.set("stats", serializedStats);
        }
    }

    const queryString = params.toString();
    const newUrl = `${window.location.pathname}${queryString ? `?${queryString}` : ""}`;

    if (shouldCreateHistoryEntry) {
        window.history.pushState({}, "", newUrl);
    } else {
        window.history.replaceState({}, "", newUrl);
    }

    return newUrl;
};

const parseLegendaryStats = (archetypeId: ArchetypeId, encodedStats: string | null) => {
    if (!encodedStats) {
        return {};
    }

    const defaultLegendaryStats = getDefaultLegendaryStats(allArchetypesById[archetypeId]);

    return encodedStats.split("_").reduce<Partial<Record<LegendaryStatInputType, number>>>((legendaryStats, pair) => {
        const separatorIndex = pair.indexOf(".");
        if (separatorIndex === -1) {
            return legendaryStats;
        }

        const statAlias = pair.slice(0, separatorIndex);
        const rawValue = pair.slice(separatorIndex + 1);
        const statKey = statAlias ? statKeysByAlias[statAlias] : undefined;
        if (!statKey || defaultLegendaryStats[statKey] === undefined) {
            return legendaryStats;
        }

        const parsedValue = rawValue ? parseInt(rawValue, 10) : Number.NaN;
        if (Number.isNaN(parsedValue)) {
            return legendaryStats;
        }

        legendaryStats[statKey] = parsedValue;
        return legendaryStats;
    }, {});
};

export const loadLegendaryFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    const itemParam = params.get("item");
    const selectedArchetypeId = isValidArchetypeId(itemParam) ? itemParam : null;
    const selectedCategoryId = getCategoryIdForArchetypeId(selectedArchetypeId);
    const legendaryStats = selectedArchetypeId ? parseLegendaryStats(selectedArchetypeId, params.get("stats")) : {};

    const { resetLegendaryStats, setLegendaryStats, setSelectedArchetypeId, setSelectedCategoryId } =
        legendaryStore.getState().actions;

    setSelectedCategoryId(selectedCategoryId);
    setSelectedArchetypeId(selectedArchetypeId);
    resetLegendaryStats();
    setLegendaryStats(legendaryStats);
};
