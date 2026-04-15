import { Archetype, CategoryId, LegendaryStatInputType, LegendaryStatType } from "../../types/models";

interface AppraisalFieldDefinition {
    inputKey: LegendaryStatInputType;
    maxKey: LegendaryStatType;
    minKey: LegendaryStatType;
}

export interface AppraisalRowDefinition {
    id: string;
    primary: AppraisalFieldDefinition;
    secondary?: AppraisalFieldDefinition;
}

export interface RatingResult {
    label: string;
    percentile: number;
    ratedRowCount: number;
}

export const appraisalRowDefinitions: AppraisalRowDefinition[] = [
    {
        id: "durability",
        primary: { inputKey: "durability", minKey: "durabilityMin", maxKey: "durabilityMax" },
    },
    {
        id: "damage",
        primary: { inputKey: "damageLow", minKey: "damageLowMin", maxKey: "damageLowMax" },
        secondary: { inputKey: "damageHigh", minKey: "damageHighMin", maxKey: "damageHighMax" },
    },
    {
        id: "directDamage",
        primary: { inputKey: "directDamage", minKey: "directDamageMin", maxKey: "directDamageMax" },
    },
    {
        id: "armorDamage",
        primary: { inputKey: "armorDamage", minKey: "armorDamageMin", maxKey: "armorDamageMax" },
    },
    {
        id: "shieldDamage",
        primary: { inputKey: "shieldDamage", minKey: "shieldDamageMin", maxKey: "shieldDamageMax" },
    },
    {
        id: "hitHeadChance",
        primary: { inputKey: "hitHeadChance", minKey: "hitHeadChanceMin", maxKey: "hitHeadChanceMax" },
    },
    {
        id: "meleeDefense",
        primary: { inputKey: "meleeDefense", minKey: "meleeDefenseMin", maxKey: "meleeDefenseMax" },
    },
    {
        id: "rangedDefense",
        primary: { inputKey: "rangedDefense", minKey: "rangedDefenseMin", maxKey: "rangedDefenseMax" },
    },
    {
        id: "fatigue",
        primary: { inputKey: "fatigue", minKey: "fatigueMin", maxKey: "fatigueMax" },
    },
    {
        id: "fatigueSkillCost",
        primary: { inputKey: "fatigueSkillCost", minKey: "fatigueSkillCostMin", maxKey: "fatigueSkillCostMax" },
    },
    {
        id: "accuracy",
        primary: { inputKey: "accuracy", minKey: "accuracyMin", maxKey: "accuracyMax" },
    },
    {
        id: "ammo",
        primary: { inputKey: "ammo", minKey: "ammoMin", maxKey: "ammoMax" },
    },
];

const ratingTiers = [
    { minimum: 95, label: "Godly" },
    { minimum: 85, label: "Excellent" },
    { minimum: 70, label: "Strong" },
    { minimum: 55, label: "Good" },
    { minimum: 40, label: "Average" },
    { minimum: 20, label: "Weak" },
    { minimum: 0, label: "Poor" },
];

const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
};

export const getPercentile = (value: number, min: number, max: number) => {
    if (min === max) {
        return 100;
    }

    return clamp(((value - min) / (max - min)) * 100, 0, 100);
};

export const getRangeValue = (archetype: Archetype, key: LegendaryStatType) => {
    const value = (archetype as unknown as Record<string, unknown>)[key];
    return typeof value === "number" ? value : undefined;
};

export const getDefaultLegendaryStats = (archetype: Archetype) => {
    return appraisalRowDefinitions.reduce<Partial<Record<LegendaryStatInputType, number>>>((accumulator, definition) => {
        const primaryMin = getRangeValue(archetype, definition.primary.minKey);
        if (primaryMin === undefined) {
            return accumulator;
        }

        accumulator[definition.primary.inputKey] =
            definition.primary.inputKey === "fatigueSkillCost" ? 0 : primaryMin;

        if (definition.secondary) {
            const secondaryMin = getRangeValue(archetype, definition.secondary.minKey);
            if (secondaryMin !== undefined) {
                accumulator[definition.secondary.inputKey] = secondaryMin;
            }
        }

        return accumulator;
    }, {});
};

const getCurrentStatValue = (
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    inputKey: LegendaryStatInputType,
) => {
    return legendaryStats[inputKey] ?? defaultLegendaryStats[inputKey];
};

export const isAppraisalRowModified = (
    definition: AppraisalRowDefinition,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    const primaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.primary.inputKey);
    const defaultPrimaryValue = defaultLegendaryStats[definition.primary.inputKey];

    if (primaryValue !== defaultPrimaryValue) {
        return true;
    }

    if (!definition.secondary) {
        return false;
    }

    const secondaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.secondary.inputKey);
    const defaultSecondaryValue = defaultLegendaryStats[definition.secondary.inputKey];

    return secondaryValue !== defaultSecondaryValue;
};

const getRowPercentile = (
    definition: AppraisalRowDefinition,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    const primaryMin = getRangeValue(archetype, definition.primary.minKey);
    const primaryMax = getRangeValue(archetype, definition.primary.maxKey);
    const primaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.primary.inputKey);

    if (primaryMin === undefined || primaryMax === undefined || primaryValue === undefined) {
        return undefined;
    }

    const rowPercentiles = [getPercentile(primaryValue, primaryMin, primaryMax)];

    if (definition.secondary) {
        const secondaryMin = getRangeValue(archetype, definition.secondary.minKey);
        const secondaryMax = getRangeValue(archetype, definition.secondary.maxKey);
        const secondaryValue = getCurrentStatValue(legendaryStats, defaultLegendaryStats, definition.secondary.inputKey);

        if (secondaryMin !== undefined && secondaryMax !== undefined && secondaryValue !== undefined) {
            rowPercentiles.push(getPercentile(secondaryValue, secondaryMin, secondaryMax));
        }
    }

    return rowPercentiles.reduce((sum, value) => sum + value, 0) / rowPercentiles.length;
};

const isDurabilityRelevantForRating = (categoryId: CategoryId) => {
    return categoryId === "shield" || categoryId === "armor" || categoryId === "helmet";
};

export const getOverallRating = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    categoryId: CategoryId,
): RatingResult => {
    const rowPercentiles = appraisalRowDefinitions.flatMap((definition) => {
        const primaryMin = getRangeValue(archetype, definition.primary.minKey);
        if (primaryMin === undefined) {
            return [];
        }

        if (definition.id === "durability" && !isDurabilityRelevantForRating(categoryId)) {
            return [];
        }

        if (!isAppraisalRowModified(definition, legendaryStats, defaultLegendaryStats)) {
            return [];
        }

        const rowPercentile = getRowPercentile(definition, archetype, legendaryStats, defaultLegendaryStats);
        return rowPercentile === undefined ? [] : [rowPercentile];
    });

    if (rowPercentiles.length === 0) {
        return { label: "Unrated", percentile: 0, ratedRowCount: 0 };
    }

    const averagePercentile = rowPercentiles.reduce((sum, value) => sum + value, 0) / rowPercentiles.length;
    const label = ratingTiers.find((tier) => averagePercentile >= tier.minimum)!.label;

    return {
        label,
        percentile: Math.round(averagePercentile),
        ratedRowCount: rowPercentiles.length,
    };
};

const getModifiedRowIds = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    return appraisalRowDefinitions
        .filter((definition) => getRangeValue(archetype, definition.primary.minKey) !== undefined)
        .filter((definition) => isAppraisalRowModified(definition, legendaryStats, defaultLegendaryStats))
        .map((definition) => definition.id);
};

export const isAppraisalComplete = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    categoryId: CategoryId,
) => {
    const modifiedRowIds = getModifiedRowIds(archetype, legendaryStats, defaultLegendaryStats);
    const nonDurabilityModifiedCount = modifiedRowIds.filter((rowId) => rowId !== "durability").length;

    if (categoryId === "shield") {
        return modifiedRowIds.includes("durability") && nonDurabilityModifiedCount >= 2;
    }

    if (categoryId === "armor" || categoryId === "helmet") {
        return modifiedRowIds.includes("durability") && modifiedRowIds.includes("fatigue");
    }

    return nonDurabilityModifiedCount >= 2;
};

export const getArchetypeSubtitle = (archetype: Archetype) => {
    if ("meleeDefenseMin" in archetype) {
        return "Named Shield";
    }
    if ("accuracyMin" in archetype || "ammoMin" in archetype) {
        return "Named Ranged Weapon";
    }
    if ("damageLowMin" in archetype && "damageHighMin" in archetype) {
        return "Named Weapon";
    }
    if ("fatigueMin" in archetype) {
        return "Named Armor";
    }

    return "Named Item";
};

export const getCompletedAppraisalLine = (rating: RatingResult) => {
    switch (rating.label) {
        case "Godly":
            return "Ho. That's wicked good work, that is. I wouldn't part with it cheap unless I was already halfway dead.";
        case "Excellent":
            return "Aye, that's fine work. Better than most named kit what comes across this table, and I've seen plenty buried with their owners.";
        case "Strong":
            return "Strong piece, that. Not blessed by saints, maybe, but it'd keep yeh breathing longer than a prayer.";
        case "Good":
            return "Good, solid work. The sort of thing folk brag on after a win and cling to after a bad night.";
        case "Average":
            return "Middle sort of piece. Won't make a song, won't make a funeral either. Least, not straightaway.";
        case "Weak":
            return "Named, sure. So's a pig if yeh shout at it long enough.";
        default:
            return "It'll serve if the other poor bastard's worse equipped than yeh. I've seen worse. Usually on the floor.";
    }
};

export const getIncompleteBarkeepPrompt = (
    categoryId: CategoryId,
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
) => {
    const modifiedRowIds = getModifiedRowIds(archetype, legendaryStats, defaultLegendaryStats);
    const nonDurabilityModifiedCount = modifiedRowIds.filter((rowId) => rowId !== "durability").length;

    if (categoryId === "shield") {
        const missingDurability = !modifiedRowIds.includes("durability");
        if (missingDurability && nonDurabilityModifiedCount < 2) {
            return "For a shield, I need the durability and two other marks besides. Else I'm judging it like a drunk judges weather.";
        }

        if (missingDurability) {
            return "I still need the shield's durability. Pretty paint don't stop an axe.";
        }

        return "Good. Now tell me two more marks besides the durability. A shield's more than a door with opinions.";
    }

    if (categoryId === "armor" || categoryId === "helmet") {
        const missingDurability = !modifiedRowIds.includes("durability");
        const missingFatigue = !modifiedRowIds.includes("fatigue");

        if (missingDurability || missingFatigue) {
            return "For armor, I need the durability and the fatigue burden both. Kit that saves yeh and kills yeh tired is still trying to kill yeh.";
        }
    }

    if (nonDurabilityModifiedCount === 0) {
        return "Give me two more marks to work with before I judge. A dull blade sounds fine too, if yeh only praise the scabbard.";
    }

    return "One line more, then. Half a tale's how folk end up buried in the wrong boots.";
};
