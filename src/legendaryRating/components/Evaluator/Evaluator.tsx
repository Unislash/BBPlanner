import * as React from "react";
import { useEffect, useState } from "react";
import ShareIcon from "@material-ui/icons/Share";
import Tooltip from "rc-tooltip";
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
import { useLegendaryActions, useLegendaryStats, useSelectedArchetypeId } from "../../stores/legendaryStore";
import type { Archetype, CategoryId, LegendaryStatInputType, LegendaryStatType } from "../../types/models";
import { allArchetypesById } from "../../data/archetypes";
import { LegendaryStatBar } from "./LegendaryStatBar";
import { type LegendaryItemImageMap, loadLegendaryPreviewMap } from "../LegendaryPicker/legendaryItemImageMap";
import {
    getArchetypeSubtitle,
    getRatingDetails,
    getOverallRating,
    getDefaultLegendaryStats,
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
        primary: { inputKey: "minimumDamage", minKey: "minimumDamageMin", maxKey: "minimumDamageMax" },
        secondary: { inputKey: "maximumDamage", minKey: "maximumDamageMin", maxKey: "maximumDamageMax" },
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
        tone: "gray",
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
        label: "Skill Fatigue Reduction",
        primary: { inputKey: "fatigueSkillCost", minKey: "fatigueSkillCostMin", maxKey: "fatigueSkillCostMax" },
        tone: "blue",
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
        return "The barkeep hefts the piece slightly, judging the weight and make before you give him the marks.";
    }

    if (categoryId === "shield") {
        return "The barkeep taps the face and rim, listening to the resonance of the shield.";
    }

    return "The barkeep studies the weapon's balance and finish for a moment before you give him the marks.";
};

const copyUrlToClipboard = async () => {
    const text = window.location.href;

    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const dummy = document.createElement("input");
    dummy.style.opacity = "0";
    dummy.style.position = "absolute";
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
};

export const Evaluator = ({ categoryId, legendaryItemImageMap }: EvaluatorProps): React.ReactElement | null => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const { setLegendaryStat } = useLegendaryActions();
    const selectedArchetype = selectedArchetypeId ? allArchetypesById[selectedArchetypeId] : undefined;
    const [legendaryPreviewImageMap, setLegendaryPreviewImageMap] = useState<LegendaryItemImageMap>();
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isShareTooltipVisible, setIsShareTooltipVisible] = useState(false);
    const shareTooltipTimeoutRef = React.useRef<number | null>(null);

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

    const defaultLegendaryStats = selectedArchetype ? getDefaultLegendaryStats(selectedArchetype) : {};
    const overallRating = selectedArchetype
        ? getOverallRating(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId)
        : { label: "Unrated", percentile: 0, ratedRowCount: 0 };
    const appraisalComplete = selectedArchetype
        ? isAppraisalComplete(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId)
        : false;
    const ratingDetails = getRatingDetails(overallRating);
    const overallRatingTooltip = (
        <>
            This rating indicates how good this item is compared to other possible pieces of equipment that you are
            likely to come across.
            <br />
            <br />
            Even poorly rated named items are likely a worthy upgrade over standard equipment.
        </>
    );

    useEffect(() => {
        if (!appraisalComplete) {
            setIsDetailsOpen(false);
        }
    }, [appraisalComplete]);

    useEffect(() => {
        return () => {
            if (shareTooltipTimeoutRef.current !== null) {
                window.clearTimeout(shareTooltipTimeoutRef.current);
            }
        };
    }, []);

    const handleShareClick = async () => {
        await copyUrlToClipboard();

        if (shareTooltipTimeoutRef.current !== null) {
            window.clearTimeout(shareTooltipTimeoutRef.current);
        }

        setIsShareTooltipVisible(true);
        shareTooltipTimeoutRef.current = window.setTimeout(() => {
            setIsShareTooltipVisible(false);
            shareTooltipTimeoutRef.current = null;
        }, 3000);
    };

    if (!selectedArchetype) {
        return null;
    }
    const statRows = statRowDefinitions.filter((definition) => {
        return getRangeValue(selectedArchetype, definition.primary.minKey) !== undefined;
    });

    return (
        <div className="legendaryEvaluator">
            <div className="legendarySceneStage">
                <div className="legendaryPlacedItem">
                    <div className="legendaryPlacedItemCard">
                        <div className="legendaryPlacedItemName">{selectedArchetype.name}</div>
                        <div className="legendaryPlacedItemType">{getArchetypeSubtitle(selectedArchetype)}</div>
                        <div className="legendaryPreviewFrame legendaryPreviewFrame_tabletop">
                            {(legendaryPreviewImageMap || legendaryItemImageMap) && (
                                <img
                                    className="legendaryPreviewImage"
                                    src={
                                        legendaryPreviewImageMap?.[selectedArchetype.imageName] ||
                                        legendaryItemImageMap?.[selectedArchetype.imageName]
                                    }
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
                        <div className="legendaryPlacedItemCopy">{getPlacedItemCopy(categoryId)}</div>
                        <div className="legendaryPlacedItemShadow" />
                    </div>
                </div>
                <div className="legendaryAppraisalSheet legendaryCard">
                    <div className="legendaryCardBody legendaryCardBody_paper">
                        <div className={`legendaryAppraisalPrompt ${appraisalComplete ? "isComplete" : ""}`}>
                            <div className="legendaryAppraisalPromptContent">
                                <div className="legendaryAppraisalPromptRow">
                                    <div className="legendaryAppraisalPromptTitle">
                                        {appraisalComplete ? overallRating.label : "What marks does it bear?"}
                                    </div>
                                    {appraisalComplete && (
                                        <div className="legendaryAppraisalPromptMetaGroup">
                                            <Tooltip
                                                overlay={overallRatingTooltip}
                                                placement="bottom"
                                                mouseEnterDelay={0.2}
                                                overlayClassName="plannerButtonTooltip"
                                            >
                                                <div className="legendaryAppraisalPromptMeta legendaryAppraisalPromptMeta_info">
                                                    {overallRating.percentile}% Quality
                                                </div>
                                            </Tooltip>
                                            <Tooltip
                                                overlay="URL copied to the clipboard!"
                                                placement="bottom"
                                                visible={isShareTooltipVisible}
                                                overlayClassName="plannerButtonTooltip"
                                            >
                                                <button
                                                    type="button"
                                                    className="legendaryShareButton"
                                                    aria-label="Share this rating"
                                                    onClick={() => {
                                                        void handleShareClick();
                                                    }}
                                                >
                                                    <ShareIcon fontSize="inherit" />
                                                </button>
                                            </Tooltip>
                                        </div>
                                    )}
                                </div>
                                {appraisalComplete && (
                                    <button
                                        type="button"
                                        className="legendaryDetailsToggle"
                                        aria-expanded={isDetailsOpen}
                                        aria-controls="legendary-rating-details"
                                        onClick={() => setIsDetailsOpen((previousValue) => !previousValue)}
                                    >
                                        {isDetailsOpen ? "Hide details" : "Details"}
                                    </button>
                                )}
                            </div>
                        </div>
                        {appraisalComplete && (
                            <div
                                id="legendary-rating-details"
                                className={`legendaryDetailsAccordion ${isDetailsOpen ? "isOpen" : ""}`}
                                aria-hidden={!isDetailsOpen}
                            >
                                <div className="legendaryDetailsAccordionInner">
                                    <ul className="legendaryDetailsList">
                                        {ratingDetails.map((detail) => (
                                            <li key={detail} className="legendaryDetailsItem">
                                                {detail}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
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
                                        isModified={isAppraisalRowModified(
                                            definition,
                                            selectedArchetype,
                                            legendaryStats,
                                            defaultLegendaryStats,
                                        )}
                                        label={definition.label}
                                        tone={definition.tone}
                                        rangeText={getRangeText(definition, selectedArchetype)}
                                        primary={{
                                            min: primaryMin,
                                            max: primaryMax,
                                            value: legendaryStats[definition.primary.inputKey] ?? primaryMin,
                                            onCommit: (value: number) =>
                                                setLegendaryStat(definition.primary.inputKey, value),
                                        }}
                                        secondary={
                                            definition.secondary &&
                                            secondaryMin !== undefined &&
                                            secondaryMax !== undefined
                                                ? {
                                                      min: secondaryMin,
                                                      max: secondaryMax,
                                                      value:
                                                          legendaryStats[definition.secondary.inputKey] ?? secondaryMin,
                                                      onCommit: (value: number) =>
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
