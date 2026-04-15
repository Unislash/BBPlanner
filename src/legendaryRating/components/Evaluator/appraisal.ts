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
            return "Now that's a master's piece. You won't see many better than this.";
        case "Excellent":
            return "Fine work. Better than most named gear that crosses this table.";
        case "Strong":
            return "Strong work. Worth keeping close.";
        case "Good":
            return "A respectable piece, with a few good marks on it.";
        case "Average":
            return "Decent enough, though nothing to boast over.";
        case "Weak":
            return "Named, yes. Remarkable, not quite.";
        default:
            return "It'll serve, but it isn't turning any heads.";
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
            return "For a shield, tell me the durability and at least two other rolled lines before I judge it.";
        }

        if (missingDurability) {
            return "I still need the shield's durability. The board itself matters here.";
        }

        return "Give me at least two other rolled lines besides the durability and I'll judge the shield properly.";
    }

    if (categoryId === "armor" || categoryId === "helmet") {
        const missingDurability = !modifiedRowIds.includes("durability");
        const missingFatigue = !modifiedRowIds.includes("fatigue");

        if (missingDurability && missingFatigue) {
            return "For armor, I need both the durability and the fatigue burden before I can judge the piece.";
        }

        if (missingDurability) {
            return "I still need the durability before I can judge this properly.";
        }

        return "Tell me the fatigue burden as well. Weight matters on armor.";
    }

    if (nonDurabilityModifiedCount === 0) {
        return "Give me at least two rolled fighting lines. Wear on the weapon itself won't decide the appraisal.";
    }

    return "One line isn't enough. Give me one more rolled fighting mark and I'll judge it.";
};
