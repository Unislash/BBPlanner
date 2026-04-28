import * as React from "react";
import fatigueIcon from "../../images/stats/fatigue.png";
import healthIcon from "../../images/stats/health.png";
import initiativeIcon from "../../images/stats/initiative.png";
import levelIcon from "../../images/stats/leveled_up.png";
import mattackIcon from "../../images/stats/mattack.png";
import mdefenseIcon from "../../images/stats/mdefense.png";
import rattackIcon from "../../images/stats/rattack.png";
import rdefenseIcon from "../../images/stats/rdefense.png";
import resolveIcon from "../../images/stats/resolve.png";
import { useActivePerkIds } from "../../stores/perkStore";
import { useStars, useStarsActions } from "../../stores/starsStore";
import { useStatNums, useStatsActions } from "../../stores/statsStore";
import type { StatType } from "../../types/models";
import { ForecastInfoButton } from "./ForecastInfoButton";
import { LevelBar } from "./LevelBar";
import { StatBar, type StatInteractionAnnotation } from "./StatBar";

export const StatsForecast = (): JSX.Element => {
    const activePerkIds = useActivePerkIds();
    const statNums = useStatNums();
    const { setStat } = useStatsActions();
    const stars = useStars();
    const { setStar } = useStarsActions();
    const hasGifted = activePerkIds.includes("gifted");
    const hasColossus = activePerkIds.includes("colossus");
    const hasFortifiedMind = activePerkIds.includes("fortifiedMind");

    const getGiftedBonus = (statType: StatType) => {
        switch (statType) {
            case "health":
            case "fatigue":
            case "resolve":
            case "rattack":
            case "rdefense":
                return hasGifted ? 4 : 0;
            case "initiative":
                return hasGifted ? 5 : 0;
            case "mattack":
            case "mdefense":
                return hasGifted ? 3 : 0;
            default:
                return 0;
        }
    };

    const getInteractionAnnotations = (statType: StatType): StatInteractionAnnotation[] => {
        const annotations: StatInteractionAnnotation[] = [];
        const giftedBonus = getGiftedBonus(statType);

        if (giftedBonus > 0) {
            annotations.push({
                symbol: "*",
                tooltipText: `This stat includes the Gifted perk bonus (+${giftedBonus}).`,
            });
        }
        if (statType === "health" && hasColossus) {
            annotations.push({
                symbol: "✤",
                tooltipText: "This stat includes the Colossus perk bonus (+25% maximum hitpoints).",
            });
        }
        if (statType === "resolve" && hasFortifiedMind) {
            annotations.push({
                symbol: "†",
                tooltipText: "This stat includes the Fortified Mind perk bonus (+25% resolve).",
            });
        }

        return annotations;
    };

    const getSetStat = (statType: StatType) => {
        return (value: number) => {
            setStat(statType, value);
        };
    };

    const getSetStar = (statType: StatType) => {
        return (value: number) => {
            setStar(statType, value);
        };
    };

    return (
        <div className="statsForecast">
            <h2 className="statsForecastHeader">
                Stats Forecast <ForecastInfoButton />
            </h2>
            <p>Enter your current level, stats, and stars to see the expected max stats</p>
            <div className="statBars">
                <LevelBar icon={levelIcon} levelNumber={statNums.level} setLevelNumber={getSetStat("level")} />
                <StatBar
                    icon={healthIcon}
                    statNumber={statNums.health}
                    setStatNumber={getSetStat("health")}
                    statType={"health"}
                    stars={stars.health}
                    setStars={getSetStar("health")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("health")}
                    interactionAnnotations={getInteractionAnnotations("health")}
                    perkMultiplier={hasColossus ? 0.25 : undefined}
                />
                <StatBar
                    icon={fatigueIcon}
                    statNumber={statNums.fatigue}
                    setStatNumber={getSetStat("fatigue")}
                    statType={"fatigue"}
                    stars={stars.fatigue}
                    setStars={getSetStar("fatigue")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("fatigue")}
                    interactionAnnotations={getInteractionAnnotations("fatigue")}
                />
                <StatBar
                    icon={resolveIcon}
                    statNumber={statNums.resolve}
                    setStatNumber={getSetStat("resolve")}
                    statType={"resolve"}
                    stars={stars.resolve}
                    setStars={getSetStar("resolve")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("resolve")}
                    interactionAnnotations={getInteractionAnnotations("resolve")}
                    perkMultiplier={hasFortifiedMind ? 0.25 : undefined}
                />
                <StatBar
                    icon={initiativeIcon}
                    statNumber={statNums.initiative}
                    setStatNumber={getSetStat("initiative")}
                    statType={"initiative"}
                    stars={stars.initiative}
                    setStars={getSetStar("initiative")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("initiative")}
                    interactionAnnotations={getInteractionAnnotations("initiative")}
                />
                <StatBar
                    icon={mattackIcon}
                    statNumber={statNums.mattack}
                    setStatNumber={getSetStat("mattack")}
                    statType={"mattack"}
                    stars={stars.mattack}
                    setStars={getSetStar("mattack")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("mattack")}
                    interactionAnnotations={getInteractionAnnotations("mattack")}
                />
                <StatBar
                    icon={rattackIcon}
                    statNumber={statNums.rattack}
                    setStatNumber={getSetStat("rattack")}
                    statType={"rattack"}
                    stars={stars.rattack}
                    setStars={getSetStar("rattack")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("rattack")}
                    interactionAnnotations={getInteractionAnnotations("rattack")}
                />
                <StatBar
                    icon={mdefenseIcon}
                    statNumber={statNums.mdefense}
                    setStatNumber={getSetStat("mdefense")}
                    statType={"mdefense"}
                    stars={stars.mdefense}
                    setStars={getSetStar("mdefense")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("mdefense")}
                    interactionAnnotations={getInteractionAnnotations("mdefense")}
                />
                <StatBar
                    icon={rdefenseIcon}
                    statNumber={statNums.rdefense}
                    setStatNumber={getSetStat("rdefense")}
                    statType={"rdefense"}
                    stars={stars.rdefense}
                    setStars={getSetStar("rdefense")}
                    currentLevel={statNums.level}
                    giftedBonus={getGiftedBonus("rdefense")}
                    interactionAnnotations={getInteractionAnnotations("rdefense")}
                />
            </div>
        </div>
    );
};
