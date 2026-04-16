import classcat from "classcat";
import * as React from "react";
import { type ChangeEvent, useRef, useState } from "react";
import arrow_right from "../../images/arrow_right.png";
import type { StatType } from "../../types/models";
import { Star } from "./Star";

type BarColor = "red" | "yellow" | "blue" | "brown";

interface StatBarProps {
    currentLevel: number;
    giftedBonus?: number;
    icon: string;
    interactionSymbols?: string;
    setStars: (value: number) => void;
    setStatNumber: (value: number) => void;
    stars: number;
    statNumber: number;
    statType: StatType;
    perkMultiplier?: number;
}

const levelIncrementByStat: { [key: string]: number } = {
    health: 3,
    fatigue: 3,
    resolve: 3,
    initiative: 4,
    mattack: 2,
    rattack: 3,
    mdefense: 2,
    rdefense: 3,
};

const getMaxStat = (
    statType: StatType,
    startValue: number,
    stars: number,
    remainingLevels: number,
    giftedBonus: number,
    perkMultiplier: number,
): number => {
    const standardMax = startValue + (levelIncrementByStat[statType] + stars * 0.5) * remainingLevels + giftedBonus;
    return Math.round(standardMax * (1 + perkMultiplier));
};

const getMinPerLevel = (statType: StatType, stars: number) => {
    return levelIncrementByStat[statType] - 1 + (stars === 3 ? 2 : stars);
};

const getMaxPerLevel = (statType: StatType, stars: number) => {
    return levelIncrementByStat[statType] + 1 + (stars === 3 ? 1 : 0);
};

const barColorByStat: { [key: string]: BarColor } = {
    health: "red",
    fatigue: "blue",
    resolve: "brown",
    initiative: "brown",
    mattack: "brown",
    rattack: "brown",
    mdefense: "brown",
    rdefense: "brown",
};

const getBarColor = (statType: StatType): BarColor => {
    return barColorByStat[statType];
};

export const StatBar: React.FC<StatBarProps> = (props) => {
    const {
        statType,
        icon,
        statNumber,
        setStatNumber,
        stars,
        setStars,
        currentLevel,
        perkMultiplier,
        giftedBonus,
        interactionSymbols,
    } = props;

    const [hoveredStarIndex, setHoveredStarIndex] = useState<number | undefined>(undefined);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Only take numbers
        const forcedNumber = event.target.value.replace(/\D/, "");
        setStatNumber(parseInt(forcedNumber || "0", 10));
    };

    const handleBarClick = () => {
        inputRef.current?.focus();
    };

    const inputRef = useRef<HTMLInputElement>(null);

    const minPerLevel = getMinPerLevel(statType, stars);
    const maxPerLevel = getMaxPerLevel(statType, stars);

    return (
        <div className="statBar">
            <img alt="" className="icon" src={icon} />
            <div className={classcat(["inputBar", getBarColor(statType)])} onClick={handleBarClick}>
                <div className="pinLeft">
                    <div className="stars">
                        <Star
                            starIndex={1}
                            currentStars={stars}
                            setCurrentStars={setStars}
                            hoveredStarIndex={hoveredStarIndex}
                            setHoveredStarIndex={setHoveredStarIndex}
                        />
                        <Star
                            starIndex={2}
                            currentStars={stars}
                            setCurrentStars={setStars}
                            hoveredStarIndex={hoveredStarIndex}
                            setHoveredStarIndex={setHoveredStarIndex}
                        />
                        <Star
                            starIndex={3}
                            currentStars={stars}
                            setCurrentStars={setStars}
                            hoveredStarIndex={hoveredStarIndex}
                            setHoveredStarIndex={setHoveredStarIndex}
                        />
                    </div>
                    <div className="statRangePerLevel">
                        +{minPerLevel === maxPerLevel ? `${minPerLevel}` : `${minPerLevel}-${maxPerLevel}`}
                    </div>
                </div>
                <div className="barTextControl">
                    <span className="barInputWidthReserver">{statNumber}</span>
                    <input
                        ref={inputRef}
                        className="barInputElement"
                        maxLength={5}
                        value={statNumber}
                        onChange={handleInputChange}
                    />
                </div>
                <img alt="" className="arrowIndicator" src={arrow_right} />
                <div className="maxStat">
                    {getMaxStat(statType, statNumber, stars, 11 - currentLevel, giftedBonus || 0, perkMultiplier || 0)}
                    {interactionSymbols || ""}
                </div>
            </div>
        </div>
    );
};
