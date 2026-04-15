import * as React from "react";
import { useEffect, useState } from "react";
import { CategoryButton } from './CategoryButton';
import { ArchetypeId, Category, CategoryId } from '../../types/models';
import { ArchetypeGridItem } from './ArchetypeGridItem';
import {
    armorArchetypes,
    helmetArchetypes,
    melee1hArchetypes,
    melee2hArchetypes,
    rangedArchetypes,
    shieldArchetypes,
} from '../../data/archetypes';
import { useLegendaryActions, useSelectedArchetypeId } from '../../stores/legendaryStore';
import { Evaluator } from '../Evaluator/Evaluator';
import { LegendaryItemImageMap, loadLegendaryThumbnailMap } from "./legendaryItemImageMap";

const categories: Category[] = [
    {
        name: 'One-Handed Weapon',
        id: 'oneHanded',
    },
    {
        name: 'Two-Handed Weapon',
        id: 'twoHanded',
    },
    {
        name: 'Ranged Weapon',
        id: 'ranged',
    },
    {
        name: 'Shield',
        id: 'shield',
    },
    {
        name: 'Helmet',
        id: 'helmet',
    },
    {
        name: 'Armor',
        id: 'armor',
    },
];

const archetypesByCategoryId = {
    oneHanded: melee1hArchetypes,
    twoHanded: melee2hArchetypes,
    ranged: rangedArchetypes,
    shield: shieldArchetypes,
    helmet: helmetArchetypes,
    armor: armorArchetypes,
};

type PickerArchetype = {
    id: ArchetypeId;
    imageName: string;
    name: string;
};

interface LegendaryPickerProps {
    selectedCategoryId: CategoryId;
    setSelectedCategoryId: (categoryId: CategoryId) => void;
}

export const LegendaryPicker = ({ selectedCategoryId, setSelectedCategoryId }: LegendaryPickerProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const {setSelectedArchetypeId} = useLegendaryActions();

    const [legendaryItemImageMap, setLegendaryItemImageMap] = useState<LegendaryItemImageMap>();

    useEffect(() => {
        let isSubscribed = true;

        async function getItemImageMap() {
            setLegendaryItemImageMap(undefined);

            return loadLegendaryThumbnailMap(selectedCategoryId)
                .then((loadedLegendaryItemImageMap) => {
                    if (isSubscribed) {
                        setLegendaryItemImageMap(loadedLegendaryItemImageMap);
                    }
                })
                .catch(() => "An error occurred while loading legendary item image map");
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        getItemImageMap();

        return () => {
            isSubscribed = false;
        };
    }, [selectedCategoryId]);

    return (
        <div className="legendaryPicker">
            <div className="legendaryCategoryStrip">
                <div className="categories">
                    {categories.map(({name, id}) => (
                        <CategoryButton
                            key={id}
                            name={name}
                            selected={selectedCategoryId === id}
                            onClick={() => {
                                setSelectedCategoryId(id);
                                setSelectedArchetypeId(null);
                            }}
                        />
                    ))}
                </div>
            </div>
            {selectedArchetypeId == null ?
                <div className="legendarySelectionTray">
                    <div className="legendarySelectionTrayHeader">
                        <div>
                            <div className="legendarySelectionTrayTitle">Choose A Piece To Inspect</div>
                            <div className="legendarySelectionCopy">
                                Lay one of these named pieces on the barkeep&apos;s table and he&apos;ll size up the work.
                            </div>
                        </div>
                    </div>
                    <div className="archetypeGrid">
                        {
                            (Object.values(archetypesByCategoryId[selectedCategoryId]) as PickerArchetype[]).map(({ id, imageName, name }) => {
                                return (
                                    <ArchetypeGridItem
                                        key={id}
                                        id={id}
                                        onClick={() => {
                                            setSelectedArchetypeId(id);
                                        }}
                                        imageName={imageName}
                                        name={name}
                                        legendaryItemImageMap={legendaryItemImageMap}
                                        className="archetypeGridItem"
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            : <Evaluator
                categoryId={selectedCategoryId}
                legendaryItemImageMap={legendaryItemImageMap}
            />}
        </div>
    );
};
