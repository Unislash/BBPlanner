import * as React from "react";
import {
    useLegendaryActions,
    useLegendaryImageMap,
    useLegendaryStats,
    useSelectedArchetypeId,
} from '../../stores/legendaryStore';
import mattackIcon from '../../../planner/images/stats/mattack.png';
import resolveIcon from '../../../planner/images/stats/resolve.png';
import rdefenseIcon from '../../../planner/images/stats/rdefense.png';
import fatigueIcon from '../../../planner/images/stats/fatigue.png';
import { LegendaryStatBar } from './LegendaryStatBar';
import { ArchetypeGridItem } from '../LegendaryPicker/ArchetypeGridItem';
import { allArchetypesById } from '../../data/archetypes';
import { useEffect } from "react";

export const Evaluator = (): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryItemImageMap = useLegendaryImageMap();
    const legendaryStats = useLegendaryStats();
    const {setLegendaryStat} = useLegendaryActions();

    useEffect(() => {
        if (!selectedArchetypeId) {
            return;
        }
        const selectedArchetype = allArchetypesById[selectedArchetypeId];
        Object.keys(selectedArchetype).forEach(archetypeAttribute => {
            switch(archetypeAttribute) {
                case "durabilityMin":
                    setLegendaryStat('durability', selectedArchetype!.durabilityMin!);
                    break;
                case "meleeDefenseMin":
                    setLegendaryStat('meleeDefense', (selectedArchetype as any).meleeDefenseMin);
                    break;
                case "rangedDefenseMin":
                    setLegendaryStat('rangedDefense', (selectedArchetype as any).rangedDefenseMin);
                    break;
                case "fatigueSkillCostMin":
                    setLegendaryStat('fatigueSkillCost', (selectedArchetype as any).fatigueSkillCostMin);
                    break;
                case "fatigueMin":
                    setLegendaryStat('fatigue', selectedArchetype.fatigueMin);
                    break;
            }
        });
    }, [selectedArchetypeId]);

    return (
        <div className="legendaryPicker">
            <div className="itemSkins">
                {
                    selectedArchetypeId && allArchetypesById[selectedArchetypeId].alternateImages.map((imageName) => {
                        return (
                            <ArchetypeGridItem
                                key={allArchetypesById[selectedArchetypeId].id}
                                id={allArchetypesById[selectedArchetypeId].id}
                                onClick={() => {}}
                                imageName={imageName}
                                name={allArchetypesById[selectedArchetypeId].name}
                                legendaryItemImageMap={legendaryItemImageMap}
                                className="archetypeGridItem"
                            />
                        )
                    })
                }
            </div>
            <div className="legendaryStats">
                {
                    selectedArchetypeId && Object.keys(allArchetypesById[selectedArchetypeId]).map(archetypeAttribute => {
                        switch (archetypeAttribute) {
                            case 'durabilityMin':
                                return <LegendaryStatBar
                                    icon={resolveIcon}
                                    statNumber={legendaryStats['durability'] || 0}
                                    statType={'durability'}
                                />;
                            case 'meleeDefenseMin':
                                return <LegendaryStatBar
                                    icon={mattackIcon}
                                    statNumber={legendaryStats['meleeDefense'] || 0}
                                    statType={'meleeDefense'}
                                />;
                            case 'rangedDefenseMin':
                                return <LegendaryStatBar
                                    icon={rdefenseIcon}
                                    statNumber={legendaryStats['rangedDefense'] || 0}
                                    statType={'rangedDefense'}
                                />;
                            case 'fatigueSkillCostMin':
                                return <LegendaryStatBar
                                    icon={fatigueIcon}
                                    statNumber={legendaryStats['fatigueSkillCost'] || 0}
                                    statType={'fatigueSkillCost'}
                                />;
                            case 'fatigueMin':
                                return <LegendaryStatBar
                                    icon={fatigueIcon}
                                    statNumber={legendaryStats['fatigue'] || 0}
                                    statType={'fatigue'}
                                />;
                        }
                    })
                }
            </div>
        </div>
    );
};
