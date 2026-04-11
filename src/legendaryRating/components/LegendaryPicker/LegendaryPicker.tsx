import * as React from "react";
import { useEffect, useState } from "react";
import { CategoryButton } from './CategoryButton';
import { Category } from '../../types/models';
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
}

export const LegendaryPicker = (): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const {setSelectedArchetypeId} = useLegendaryActions();

    const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
    const [legendaryItemImageMap, setLegendaryItemImageMap] = useState<LegendaryItemImageMap>();

    useEffect(() => {
        let isSubscribed = true;

        async function getItemImageMap() {
            setLegendaryItemImageMap(undefined);

            return loadLegendaryThumbnailMap(selectedCategory)
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
    }, [selectedCategory]);

    return (
        <div className="legendaryPicker">
            <div className="categories">
                {categories.map(({name, id}, i) => (
                    <CategoryButton
                        key={id}
                        name={name}
                        selected={selectedCategory === id}
                        onClick={() => {
                            setSelectedCategory(id);
                            setSelectedArchetypeId(null);
                        }}
                    />
                ))}
            </div>
            {selectedArchetypeId == null ?
                <div className="archetypeGrid">
                    {
                        Object.values(archetypesByCategoryId[selectedCategory]).map(({ id, imageName, name }) => {
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
            : <Evaluator
                categoryId={selectedCategory}
                legendaryItemImageMap={legendaryItemImageMap}
            />}
        </div>
    );
};
