import * as React from 'react';
import classcat from 'classcat';
import {ChangeEvent, useRef, useState} from 'react';

import arrow_right from '../../images/arrow_right.png';
import {Star} from './Star';
import {StatType} from '../../models';

type BarColor = 'red' | 'yellow' | 'blue' | 'brown';

interface StatBarProps {
    statType: StatType;
    icon: string;
    statNumber: number;
    setStatNumber: (value: number) => void;
    stars: number;
    setStars: (value: number) => void;
    currentLevel: number;
    perkMultiplier?: number;
}

const levelIncrementByStat: { [key: string]: number; } = {
    health: 3,
    fatigue: 3,
    resolve: 3,
    initiative: 4,
    mattack: 2,
    rattack: 3,
    mdefense: 2,
    rdefense: 3,
};

const getMaxStat = (statType: StatType, startValue: number, stars: number, remainingLevels: number, perkMultiplier: number): number => {
    const standardMax = startValue + (levelIncrementByStat[statType] + stars * 0.5) * remainingLevels;
    return Math.round(standardMax * (1 + perkMultiplier));
};

const getMinPerLevel = (statType: StatType, stars: number) => {
    return levelIncrementByStat[statType] - 1 + (stars === 3 ? 2 : stars);
};

const getMaxPerLevel = (statType: StatType, stars: number) => {
    return levelIncrementByStat[statType] + 1 + (stars === 3 ? 1 : 0);
};

const barColorByStat: { [key: string]: BarColor; } = {
    health: 'red',
    fatigue: 'blue',
    resolve: 'brown',
    initiative: 'brown',
    mattack: 'brown',
    rattack: 'brown',
    mdefense: 'brown',
    rdefense: 'brown',
};

const getBarColor = (statType: StatType): BarColor => {
    return barColorByStat[statType];
};

export const StatBar: React.FC<StatBarProps> = props => {
    const {
        statType,
        icon,
        statNumber,
        setStatNumber,
        stars,
        setStars,
        currentLevel,
        perkMultiplier,
    } = props;

    const [hoveredStarIndex, setHoveredStarIndex] = useState<number | undefined>(undefined);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Only take numbers
        const forcedNumber = event.target.value.replace(/\D/,'');
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
            <img className="icon" src={icon} />
            <div
                className={classcat(['inputBar', getBarColor(statType)])}
                onClick={handleBarClick}
            >
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
                    <input ref={inputRef} className="barInputElement" maxLength={5} value={statNumber} onChange={handleInputChange} />
                </div>
                <img className="arrowIndicator" src={arrow_right} />
                <div className="maxStat">
                    {getMaxStat(statType, statNumber, stars, 11 - currentLevel, perkMultiplier || 0)}
                    {perkMultiplier ? '*' : ''}
                </div>
            </div>
        </div>
    );
};