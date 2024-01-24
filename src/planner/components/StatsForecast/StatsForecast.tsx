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
import { StatType } from "../../types/plannerModels";
import { ForecastInfoButton } from "./ForecastInfoButton";
import { LevelBar } from "./LevelBar";
import { StatBar } from "./StatBar";

export const StatsForecast = (): JSX.Element => {
    const activePerkIds = useActivePerkIds();
    const statNums = useStatNums();
    const { setStat } = useStatsActions();
    const stars = useStars();
    const { setStar } = useStarsActions();

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
                <LevelBar icon={levelIcon} levelNumber={statNums["level"]} setLevelNumber={getSetStat("level")} />
                <StatBar
                    icon={healthIcon}
                    statNumber={statNums["health"]}
                    setStatNumber={getSetStat("health")}
                    statType={"health"}
                    stars={stars["health"]}
                    setStars={getSetStar("health")}
                    currentLevel={statNums["level"]}
                    perkMultiplier={activePerkIds.includes("colossus") ? 0.25 : undefined}
                />
                <StatBar
                    icon={fatigueIcon}
                    statNumber={statNums["fatigue"]}
                    setStatNumber={getSetStat("fatigue")}
                    statType={"fatigue"}
                    stars={stars["fatigue"]}
                    setStars={getSetStar("fatigue")}
                    currentLevel={statNums["level"]}
                />
                <StatBar
                    icon={resolveIcon}
                    statNumber={statNums["resolve"]}
                    setStatNumber={getSetStat("resolve")}
                    statType={"resolve"}
                    stars={stars["resolve"]}
                    setStars={getSetStar("resolve")}
                    currentLevel={statNums["level"]}
                    perkMultiplier={activePerkIds.includes("fortifiedMind") ? 0.25 : undefined}
                />
                <StatBar
                    icon={initiativeIcon}
                    statNumber={statNums["initiative"]}
                    setStatNumber={getSetStat("initiative")}
                    statType={"initiative"}
                    stars={stars["initiative"]}
                    setStars={getSetStar("initiative")}
                    currentLevel={statNums["level"]}
                />
                <StatBar
                    icon={mattackIcon}
                    statNumber={statNums["mattack"]}
                    setStatNumber={getSetStat("mattack")}
                    statType={"mattack"}
                    stars={stars["mattack"]}
                    setStars={getSetStar("mattack")}
                    currentLevel={statNums["level"]}
                />
                <StatBar
                    icon={rattackIcon}
                    statNumber={statNums["rattack"]}
                    setStatNumber={getSetStat("rattack")}
                    statType={"rattack"}
                    stars={stars["rattack"]}
                    setStars={getSetStar("rattack")}
                    currentLevel={statNums["level"]}
                />
                <StatBar
                    icon={mdefenseIcon}
                    statNumber={statNums["mdefense"]}
                    setStatNumber={getSetStat("mdefense")}
                    statType={"mdefense"}
                    stars={stars["mdefense"]}
                    setStars={getSetStar("mdefense")}
                    currentLevel={statNums["level"]}
                />
                <StatBar
                    icon={rdefenseIcon}
                    statNumber={statNums["rdefense"]}
                    setStatNumber={getSetStat("rdefense")}
                    statType={"rdefense"}
                    stars={stars["rdefense"]}
                    setStars={getSetStar("rdefense")}
                    currentLevel={statNums["level"]}
                />
            </div>
        </div>
    );
};
