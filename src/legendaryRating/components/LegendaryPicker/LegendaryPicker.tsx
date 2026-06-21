import * as React from "react";
import { useEffect, useState } from "react";
import { CategoryButton } from "./CategoryButton";
import type { ArchetypeId, Category, SelectedCategoryId } from "../../types/models";
import { ArchetypeGridItem } from "./ArchetypeGridItem";
import {
    armorArchetypes,
    helmetArchetypes,
    melee1hArchetypes,
    melee2hArchetypes,
    rangedArchetypes,
    shieldArchetypes,
} from "../../data/archetypes";
import { useLegendaryActions, useSelectedArchetypeId } from "../../stores/legendaryStore";
import { Evaluator } from "../Evaluator/Evaluator";
import { type LegendaryItemImageMap, loadLegendaryThumbnailMap } from "./legendaryItemImageMap";

const categories: Category[] = [
    {
        name: "One-Handed Weapon",
        id: "oneHanded",
    },
    {
        name: "Two-Handed Weapon",
        id: "twoHanded",
    },
    {
        name: "Ranged Weapon",
        id: "ranged",
    },
    {
        name: "Shield",
        id: "shield",
    },
    {
        name: "Helmet",
        id: "helmet",
    },
    {
        name: "Armor",
        id: "armor",
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
    selectedCategoryId: SelectedCategoryId;
    setSelectedCategoryId: (categoryId: SelectedCategoryId) => void;
}

export const LegendaryPicker = ({ selectedCategoryId, setSelectedCategoryId }: LegendaryPickerProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const { resetLegendaryStats, setSelectedArchetypeId } = useLegendaryActions();

    const [legendaryItemImageMap, setLegendaryItemImageMap] = useState<LegendaryItemImageMap>();

    useEffect(() => {
        let isSubscribed = true;

        setLegendaryItemImageMap(undefined);

        if (!selectedCategoryId) {
            return () => {
                isSubscribed = false;
            };
        }

        loadLegendaryThumbnailMap(selectedCategoryId)
            .then((loadedLegendaryItemImageMap) => {
                if (isSubscribed) {
                    setLegendaryItemImageMap(loadedLegendaryItemImageMap);
                }
            })
            .catch(() => "An error occurred while loading legendary item image map");

        return () => {
            isSubscribed = false;
        };
    }, [selectedCategoryId]);

    return (
        <div className="legendaryPicker">
            <div className="legendaryCategoryStrip">
                <div className="categories">
                    {categories.map(({ name, id }) => (
                        <CategoryButton
                            key={id}
                            name={name}
                            selected={selectedCategoryId === id}
                            onClick={() => {
                                setSelectedCategoryId(id);
                                setSelectedArchetypeId(null);
                                resetLegendaryStats();
                            }}
                        />
                    ))}
                </div>
            </div>
            {selectedArchetypeId == null ? (
                <div className="legendarySelectionTray">
                    {selectedCategoryId ? (
                        <div className="archetypeGrid">
                            {(Object.values(archetypesByCategoryId[selectedCategoryId]) as PickerArchetype[]).map(
                                ({ id, imageName, name }, index) => {
                                    return (
                                        <ArchetypeGridItem
                                            animationIndex={index}
                                            key={id}
                                            id={id}
                                            onClick={() => {
                                                resetLegendaryStats();
                                                setSelectedArchetypeId(id);
                                            }}
                                            imageName={imageName}
                                            name={name}
                                            legendaryItemImageMap={legendaryItemImageMap}
                                            className="archetypeGridItem"
                                        />
                                    );
                                },
                            )}
                        </div>
                    ) : (
                        <div className="legendaryEmptyState">
                            <div className="legendaryEmptyStateBody">
                                Few men alive have seen more famed weapons and armor than the old mercenary-turned-barkeep.<br/>
                                Show him a piece of equipment and he'll judge its quality, pointing out any noteworthy details.
                            </div>
                            <div className="legendaryEmptyStateCTA">To begin, choose an equipment category above.</div>
                        </div>
                    )}
                </div>
            ) : (
                selectedCategoryId && <Evaluator categoryId={selectedCategoryId} legendaryItemImageMap={legendaryItemImageMap} />
            )}
        </div>
    );
};
