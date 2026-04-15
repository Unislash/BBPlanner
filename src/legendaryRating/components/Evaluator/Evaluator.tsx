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
import {
    getArchetypeSubtitle,
    getDefaultLegendaryStats,
    getOverallRating,
    getRangeValue,
    isAppraisalComplete,
    isAppraisalRowModified,
} from "./appraisal";

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

interface EvaluatorProps {
    categoryId: CategoryId;
    legendaryItemImageMap?: LegendaryItemImageMap;
}

const getPlacedItemCopy = (categoryId: CategoryId) => {
    if (categoryId === "armor" || categoryId === "helmet") {
        return "The barkeep weighs the protection against the burden, judging the make before hearing the numbers.";
    }

    if (categoryId === "shield") {
        return "The barkeep taps the face and rim, listening to the board before hearing the rest of the marks.";
    }

    return "The barkeep studies the balance, edge, and finish before hearing the rolled fighting lines.";
};

export const Evaluator = ({ categoryId, legendaryItemImageMap }: EvaluatorProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const { setLegendaryStat, setLegendaryStats } = useLegendaryActions();
    const selectedArchetype = selectedArchetypeId ? allArchetypesById[selectedArchetypeId] : undefined;
    const [legendaryPreviewImageMap, setLegendaryPreviewImageMap] = useState<LegendaryItemImageMap>();

    useEffect(() => {
        if (!selectedArchetype) {
            return;
        }

        setLegendaryStats(getDefaultLegendaryStats(selectedArchetype));
    }, [selectedArchetype, setLegendaryStats]);

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
    const appraisalComplete = isAppraisalComplete(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId);
    const statRows = statRowDefinitions.filter((definition) => {
        return getRangeValue(selectedArchetype, definition.primary.minKey) !== undefined;
    });

    return (
        <div className="legendaryEvaluator">
            <div className="legendarySceneStage">
                <div className="legendaryPlacedItem">
                    <div className="legendaryPlacedItemCard">
                        <div className="legendaryPlacedItemEyebrow">Set On The Table</div>
                        <div className="legendaryPlacedItemName">{selectedArchetype.name}</div>
                        <div className="legendaryPlacedItemType">{getArchetypeSubtitle(selectedArchetype)}</div>
                        <div className="legendaryPreviewFrame legendaryPreviewFrame_tabletop">
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
                        <div className="legendaryPlacedItemCopy">
                            {getPlacedItemCopy(categoryId)}
                        </div>
                        <div className="legendaryPlacedItemShadow" />
                    </div>
                </div>
                <div className="legendaryAppraisalSheet legendaryCard">
                    <div className="legendaryCardBody legendaryCardBody_sheet legendaryCardBody_paper">
                        <div className={`legendaryAppraisalPrompt ${appraisalComplete ? "isComplete" : ""}`}>
                            <div className="legendaryAppraisalPromptTitle">
                                {appraisalComplete ? overallRating.label : "What marks does it bear?"}
                            </div>
                            {appraisalComplete && (
                                <div className="legendaryAppraisalPromptMeta">
                                    {overallRating.percentile}% Quality
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
                                        isModified={isAppraisalRowModified(definition, legendaryStats, defaultLegendaryStats)}
                                        label={definition.label}
                                        tone={definition.tone}
                                        rangeText={getRangeText(definition, selectedArchetype)}
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
        </div>
    );
};
