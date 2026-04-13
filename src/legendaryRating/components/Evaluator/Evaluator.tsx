import * as React from "react";
import { useEffect, useState } from "react";
import ammoIcon from "../../../planner/images/loadoutInfo/ammo.png";
import armorDamageIcon from "../../../planner/images/loadoutInfo/armor_damage.png";
import armorBodyIcon from "../../../planner/images/loadoutInfo/armor_body.png";
import chanceToHitHeadIcon from "../../../planner/images/loadoutInfo/chance_to_hit_head.png";
import directDamageIcon from "../../../planner/images/loadoutInfo/direct_damage.png";
import fatigueIcon from "../../../planner/images/loadoutInfo/fatigue.png";
import meleeDefenseIcon from "../../../planner/images/loadoutInfo/melee_defense.png";
import rangedDefenseIcon from "../../../planner/images/loadoutInfo/ranged_defense.png";
import regularDamageIcon from "../../../planner/images/loadoutInfo/regular_damage.png";
import shieldDamageIcon from "../../../planner/images/loadoutInfo/shield_damage.png";
import rattackIcon from "../../../planner/images/stats/rattack.png";
import {
    useLegendaryActions,
    useLegendaryStats,
    useSelectedArchetypeId,
} from "../../stores/legendaryStore";
import { Archetype, CategoryId, LegendaryStatInputType, LegendaryStatType } from "../../types/models";
import { allArchetypesById } from "../../data/archetypes";
import { LegendaryStatBar } from "./LegendaryStatBar";
import { LegendaryItemImageMap, loadLegendaryPreviewMap } from "../LegendaryPicker/legendaryItemImageMap";

type Tone = "red" | "yellow" | "blue" | "brown" | "gray";

interface StatFieldDefinition {
    inputKey: LegendaryStatInputType;
    maxKey: LegendaryStatType;
    minKey: LegendaryStatType;
}

interface StatRowDefinition {
    id: string;
    icon: string;
    label: string;
    primary: StatFieldDefinition;
    secondary?: StatFieldDefinition;
    tone: Tone;
    valueFormatter?: (value: number) => string;
}

interface RatingResult {
    label: string;
    percentile: number;
    ratedRowCount: number;
}

const formatPercent = (value: number) => `${value}%`;
const formatSignedNumber = (value: number) => `${value > 0 ? "+" : ""}${value}`;
const formatSignedPercent = (value: number) => `${value > 0 ? "+" : ""}${value}%`;

const statRowDefinitions: StatRowDefinition[] = [
    {
        id: "durability",
        icon: armorBodyIcon,
        label: "Durability",
        primary: { inputKey: "durability", minKey: "durabilityMin", maxKey: "durabilityMax" },
        tone: "gray",
    },
    {
        id: "damage",
        icon: regularDamageIcon,
        label: "Damage",
        primary: { inputKey: "damageLow", minKey: "damageLowMin", maxKey: "damageLowMax" },
        secondary: { inputKey: "damageHigh", minKey: "damageHighMin", maxKey: "damageHighMax" },
        tone: "red",
    },
    {
        id: "directDamage",
        icon: directDamageIcon,
        label: "Damage Ignores Armor",
        primary: { inputKey: "directDamage", minKey: "directDamageMin", maxKey: "directDamageMax" },
        tone: "red",
        valueFormatter: formatPercent,
    },
    {
        id: "armorDamage",
        icon: armorDamageIcon,
        label: "Effective Against Armor",
        primary: { inputKey: "armorDamage", minKey: "armorDamageMin", maxKey: "armorDamageMax" },
        tone: "red",
        valueFormatter: formatPercent,
    },
    {
        id: "shieldDamage",
        icon: shieldDamageIcon,
        label: "Shield Damage",
        primary: { inputKey: "shieldDamage", minKey: "shieldDamageMin", maxKey: "shieldDamageMax" },
        tone: "brown",
    },
    {
        id: "hitHeadChance",
        icon: chanceToHitHeadIcon,
        label: "Chance To Hit Head",
        primary: { inputKey: "hitHeadChance", minKey: "hitHeadChanceMin", maxKey: "hitHeadChanceMax" },
        tone: "brown",
        valueFormatter: formatSignedPercent,
    },
    {
        id: "meleeDefense",
        icon: meleeDefenseIcon,
        label: "Melee Defense",
        primary: { inputKey: "meleeDefense", minKey: "meleeDefenseMin", maxKey: "meleeDefenseMax" },
        tone: "brown",
        valueFormatter: formatSignedNumber,
    },
    {
        id: "rangedDefense",
        icon: rangedDefenseIcon,
        label: "Ranged Defense",
        primary: { inputKey: "rangedDefense", minKey: "rangedDefenseMin", maxKey: "rangedDefenseMax" },
        tone: "brown",
        valueFormatter: formatSignedNumber,
    },
    {
        id: "fatigue",
        icon: fatigueIcon,
        label: "Maximum Fatigue",
        primary: { inputKey: "fatigue", minKey: "fatigueMin", maxKey: "fatigueMax" },
        tone: "blue",
        valueFormatter: formatSignedNumber,
    },
    {
        id: "fatigueSkillCost",
        icon: fatigueIcon,
        label: "Skill Fatigue",
        primary: { inputKey: "fatigueSkillCost", minKey: "fatigueSkillCostMin", maxKey: "fatigueSkillCostMax" },
        tone: "brown",
        valueFormatter: formatSignedNumber,
    },
    {
        id: "accuracy",
        icon: rattackIcon,
        label: "Accuracy",
        primary: { inputKey: "accuracy", minKey: "accuracyMin", maxKey: "accuracyMax" },
        tone: "brown",
        valueFormatter: formatSignedPercent,
    },
    {
        id: "ammo",
        icon: ammoIcon,
        label: "Ammo",
        primary: { inputKey: "ammo", minKey: "ammoMin", maxKey: "ammoMax" },
        tone: "yellow",
        valueFormatter: formatSignedNumber,
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

const getPercentile = (value: number, min: number, max: number) => {
    if (min === max) {
        return 100;
    }

    return clamp(((value - min) / (max - min)) * 100, 0, 100);
};

const getRangeValue = (archetype: Archetype, key: LegendaryStatType) => {
    const value = (archetype as unknown as Record<string, unknown>)[key];
    return typeof value === "number" ? value : undefined;
};

const getRangeText = (definition: StatRowDefinition, archetype: Archetype) => {
    const formatValue = definition.valueFormatter || ((value: number) => `${value}`);
    const primaryMin = getRangeValue(archetype, definition.primary.minKey)!;
    const primaryMax = getRangeValue(archetype, definition.primary.maxKey)!;

    if (definition.secondary) {
        const secondaryMin = getRangeValue(archetype, definition.secondary.minKey)!;
        const secondaryMax = getRangeValue(archetype, definition.secondary.maxKey)!;
        return `Range ${formatValue(primaryMin)} 🡒 ${formatValue(primaryMax)} / ${formatValue(secondaryMin)} 🡒 ${formatValue(secondaryMax)}`;
    }

    return `Range ${formatValue(primaryMin)} 🡒 ${formatValue(primaryMax)}`;
};

const getDefaultLegendaryStats = (archetype: Archetype) => {
    return statRowDefinitions.reduce<Partial<Record<LegendaryStatInputType, number>>>((accumulator, definition) => {
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

const isDurabilityRelevantForRating = (categoryId: CategoryId) => {
    return categoryId === "shield" || categoryId === "armor" || categoryId === "helmet";
};

const getCurrentStatValue = (
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    inputKey: LegendaryStatInputType,
) => {
    return legendaryStats[inputKey] ?? defaultLegendaryStats[inputKey];
};

const isStatRowModified = (
    definition: StatRowDefinition,
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
    definition: StatRowDefinition,
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

const getOverallRating = (
    archetype: Archetype,
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    defaultLegendaryStats: Partial<Record<LegendaryStatInputType, number>>,
    categoryId: CategoryId,
): RatingResult => {
    const rowPercentiles = statRowDefinitions.flatMap((definition) => {
        const primaryMin = getRangeValue(archetype, definition.primary.minKey);
        if (primaryMin === undefined) {
            return [];
        }

        if (definition.id === "durability" && !isDurabilityRelevantForRating(categoryId)) {
            return [];
        }

        if (!isStatRowModified(definition, legendaryStats, defaultLegendaryStats)) {
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

const getArchetypeSubtitle = (archetype: Archetype) => {
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

interface EvaluatorProps {
    categoryId: CategoryId;
    legendaryItemImageMap?: LegendaryItemImageMap;
}

export const Evaluator = ({ categoryId, legendaryItemImageMap }: EvaluatorProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const { resetLegendaryStats, setLegendaryStat, setLegendaryStats, setSelectedArchetypeId } = useLegendaryActions();
    const selectedArchetype = selectedArchetypeId ? allArchetypesById[selectedArchetypeId] : undefined;
    const [legendaryPreviewImageMap, setLegendaryPreviewImageMap] = useState<LegendaryItemImageMap>();

    useEffect(() => {
        if (!selectedArchetype) {
            return;
        }

        setLegendaryStats(getDefaultLegendaryStats(selectedArchetype));
    }, [selectedArchetypeId]);

    useEffect(() => {
        let isSubscribed = true;
        setLegendaryPreviewImageMap(undefined);

        loadLegendaryPreviewMap(categoryId)
            .then((loadedLegendaryPreviewImageMap) => {
                if (isSubscribed) {
                    setLegendaryPreviewImageMap(loadedLegendaryPreviewImageMap);
                }
            })
            .catch(() => "An error occurred while loading legendary preview map");

        return () => {
            isSubscribed = false;
        };
    }, [categoryId]);

    if (!selectedArchetype) {
        return <></>;
    }

    const defaultLegendaryStats = getDefaultLegendaryStats(selectedArchetype);
    const overallRating = getOverallRating(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId);
    const statRows = statRowDefinitions.filter((definition) => {
        return getRangeValue(selectedArchetype, definition.primary.minKey) !== undefined;
    });

    return (
        <div className="legendaryEvaluator">
            <div className="legendaryEvaluatorToolbar">
                <button
                    className="legendaryActionButton"
                    onClick={() => {
                        resetLegendaryStats();
                        setSelectedArchetypeId(null);
                    }}
                >
                    Choose Another Item
                </button>
            </div>
            <div className="legendaryCard">
                <div className="legendaryCardHeader">
                    <div>
                        <div className="legendaryCardEyebrow">{getArchetypeSubtitle(selectedArchetype)}</div>
                        <h2 className="legendaryCardTitle">{selectedArchetype.name}</h2>
                        <p className="legendaryCardCopy">
                            Enter the rolls from your item to rate it against the full named-item range.
                        </p>
                    </div>
                    <div className="legendaryCardRating">
                        <span className="legendaryCardRatingLabel">Overall Rating</span>
                        <strong className="legendaryCardRatingValue">{overallRating.label}</strong>
                        <span className="legendaryCardRatingMeta">
                            {overallRating.ratedRowCount > 0
                                ? `${overallRating.percentile}% average of rolled rows`
                                : "Enter rolled rows to rate this item"}
                        </span>
                    </div>
                </div>
                <div className="legendaryCardBody">
                    <div className="legendaryCardPreview">
                        <div className="legendaryPreviewFrame">
                            {(legendaryPreviewImageMap || legendaryItemImageMap) && (
                                <img
                                    className="legendaryPreviewImage"
                                    src={legendaryPreviewImageMap?.[selectedArchetype.imageName] || legendaryItemImageMap?.[selectedArchetype.imageName]}
                                    alt={selectedArchetype.name}
                                />
                            )}
                        </div>
                        {selectedArchetype.alternateImages.length > 1 && legendaryItemImageMap && (
                            <div className="legendaryPreviewVariants">
                                {selectedArchetype.alternateImages.map((imageName) => (
                                    <img
                                        key={imageName}
                                        className="legendaryPreviewVariant"
                                        src={legendaryItemImageMap[imageName]}
                                        alt=""
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="legendaryStatsPanel">
                        {statRows.map((definition) => {
                            const primaryMin = getRangeValue(selectedArchetype, definition.primary.minKey)!;
                            const primaryMax = getRangeValue(selectedArchetype, definition.primary.maxKey)!;
                            const secondaryMin = definition.secondary
                                ? getRangeValue(selectedArchetype, definition.secondary.minKey)
                                : undefined;
                            const secondaryMax = definition.secondary
                                ? getRangeValue(selectedArchetype, definition.secondary.maxKey)
                                : undefined;

                            return (
                                <LegendaryStatBar
                                    key={definition.id}
                                    icon={definition.icon}
                                    isModified={isStatRowModified(definition, legendaryStats, defaultLegendaryStats)}
                                    label={definition.label}
                                    tone={definition.tone}
                                    rangeText={getRangeText(definition, selectedArchetype)}
                                    valueFormatter={definition.valueFormatter}
                                    primary={{
                                        min: primaryMin,
                                        max: primaryMax,
                                        value: legendaryStats[definition.primary.inputKey] ?? primaryMin,
                                        onChange: (value: number) => setLegendaryStat(definition.primary.inputKey, value),
                                    }}
                                    secondary={
                                        definition.secondary && secondaryMin !== undefined && secondaryMax !== undefined
                                            ? {
                                                  min: secondaryMin,
                                                  max: secondaryMax,
                                                  value:
                                                      legendaryStats[definition.secondary.inputKey] ??
                                                      secondaryMin,
                                                  onChange: (value: number) =>
                                                      setLegendaryStat(definition.secondary!.inputKey, value),
                                              }
                                            : undefined
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
