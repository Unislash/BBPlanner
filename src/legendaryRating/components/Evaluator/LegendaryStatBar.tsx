import * as React from "react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { LegendaryStatInputType } from '../../types/models';
import { useLegendaryActions, useLegendaryStats } from '../../stores/legendaryStore';
import classcat from "classcat";

type BarStatType =
    'durability' |
    'fatigue' |
    'damage' |
    'directDamage' |
    'armorDamage' |
    'shieldDamage' |
    'hitHeadChance' |
    'meleeDefense' |
    'rangedDefense' |
    'fatigueSkillCost' |
    'accuracy' |
    'ammo';

type BarColor = "red" | "yellow" | "blue" | "brown" | "gray";

interface LegendaryStatBarProps {
    icon: string;
    statNumber: number;
    statType: BarStatType;
}

const barColorByStat: Record<BarStatType, BarColor> = {
    durability: "gray",
    fatigue: "blue",
    damage: "red",
    directDamage: "red",
    armorDamage: "red",
    shieldDamage: "brown",
    hitHeadChance: "brown",
    meleeDefense: "brown",
    rangedDefense: "brown",
    fatigueSkillCost: "brown",
    accuracy: "brown",
    ammo: "brown",
};

const getBarColor = (statType: BarStatType): BarColor => {
    return barColorByStat[statType];
};

export const LegendaryStatBar = (props: LegendaryStatBarProps): JSX.Element => {
    const { statType, icon } = props;
    const {setLegendaryStat} = useLegendaryActions();
    const legendaryStats = useLegendaryStats();
    const [activeStat, setActiveStat] = useState<LegendaryStatInputType | undefined>(undefined);
    const [mainStat, setMainStat] = useState<number | undefined>(undefined);
    const [additionalStat, setAdditionalStat] = useState<number | undefined>(undefined);

    const mainInputRef = useRef<HTMLInputElement>(null);
    const additionalInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (statType === 'damage') {
            setMainStat(legendaryStats['damageLow']);
            setAdditionalStat(legendaryStats['damageHigh']);
        } else {
            setMainStat(legendaryStats[statType]);
        }
    }, [legendaryStats]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        // Only take numbers
        const forcedNumber = event.target.value.replace(/\D/, "");
        setLegendaryStat(activeStat!, parseInt(forcedNumber || "0", 10));
    };

    const handleBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (statType === 'damage') {
            if ((event.target as Element).className === 'mainStat') {
                mainInputRef.current?.focus();
                setActiveStat('damageLow');
            } else {
                additionalInputRef.current?.focus();
                setActiveStat('damageHigh');
            }
        } else {
            mainInputRef.current?.focus();
            setActiveStat(statType);
        }
    };

    return (
        <div className="statBar">
            <img className="icon" src={icon} />
            <div className={classcat(["inputBar", getBarColor(statType)])} onClick={handleBarClick}>
                <div className="barTextControl">
                    <span className="barInputWidthReserver">{mainStat}</span>
                    <input
                        ref={mainInputRef}
                        className="barInputElement"
                        maxLength={5}
                        value={mainStat}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
        </div>
    );
};
