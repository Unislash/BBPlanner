import * as React from 'react';
import {LoadoutItem} from '../../models';
import {LoadoutSelect} from './LoadoutSelect';
import {accessories, ammo, armor, bags, helmets, offhandItems, TWO_HANDED_WEAPON, weapons} from '../../data/itemData';
import {useLoadoutActions, useLoadoutItems} from '../../stores/loadoutStore';

const getLoadoutItemByName = (name: string, loadoutItemList: LoadoutItem[]) => {
    return loadoutItemList.find(item => name === item.id);
};

export const Loadout = (): JSX.Element => {
    const loadoutItems = useLoadoutItems();
    const {setLoadoutSlot} = useLoadoutActions();

    return (
        <div className="loadout">
            <h2>Loadout</h2>
            <p>Select your intended weapons and armor</p>
            <div className="loadoutUI">
                <div className="loadoutColumns">
                    <div className="loadoutColumn">
                        <div className="loadoutSlot accessory">
                            <LoadoutSelect
                                onItemChange={item => setLoadoutSlot("accessories", item.id)}
                                selected={getLoadoutItemByName(loadoutItems["accessories"], accessories)!}
                                options={accessories}
                                loadoutSlotType="accessories"
                            />
                        </div>
                        <div className="loadoutSlot weapon">
                            <LoadoutSelect
                                onItemChange={item => {
                                    setLoadoutSlot("weapons", item.id);
                                    if (item.id !== "" && (item as any).handType === TWO_HANDED_WEAPON) {
                                        setLoadoutSlot("offhandItems", "");
                                    }
                                }}
                                selected={getLoadoutItemByName(loadoutItems["weapons"], weapons)!}
                                options={weapons}
                                loadoutSlotType="weapons"
                            />
                        </div>
                    </div>
                    <div className="loadoutColumn">
                        <div className="loadoutSlot helmet">
                            <LoadoutSelect
                                onItemChange={item => setLoadoutSlot("helmets", item.id)}
                                selected={getLoadoutItemByName(loadoutItems["helmets"], helmets)!}
                                options={helmets}
                                loadoutSlotType="helmets"
                            />
                        </div>
                        <div className="loadoutSlot armor">
                            <LoadoutSelect
                                onItemChange={item => setLoadoutSlot("armor", item.id)}
                                selected={getLoadoutItemByName(loadoutItems["armor"], armor)!}
                                options={armor}
                                loadoutSlotType="armor"
                            />
                        </div>
                    </div>
                    <div className="loadoutColumn">
                        <div className="loadoutSlot ammo">
                            <LoadoutSelect
                                onItemChange={item => setLoadoutSlot("ammo", item.id)}
                                selected={getLoadoutItemByName(loadoutItems["ammo"], ammo)!}
                                options={ammo}
                                loadoutSlotType="ammo"
                            />
                        </div>
                        <div className="loadoutSlot offhand">
                            <LoadoutSelect
                                onItemChange={item => {
                                    setLoadoutSlot("offhandItems", item.id);
                                    const selectedWeaponItem = getLoadoutItemByName(loadoutItems["weapons"], weapons);
                                    if (item.id !== "" && (selectedWeaponItem as any).handType === TWO_HANDED_WEAPON) {
                                        setLoadoutSlot("weapons", "");
                                    }
                                }}
                                selected={getLoadoutItemByName(loadoutItems["offhandItems"], offhandItems)!}
                                options={offhandItems}
                                loadoutSlotType="offhandItems"
                            />
                        </div>
                    </div>
                </div>
                <div className="loadoutBags">
                    <div className="loadoutSlot bag">
                        <LoadoutSelect
                            onItemChange={item => setLoadoutSlot("bags1", item.id)}
                            selected={getLoadoutItemByName(loadoutItems["bags1"], bags)!}
                            options={bags}
                            loadoutSlotType="bags1"
                        />
                    </div>
                    <div className="loadoutSlot bag">
                        <LoadoutSelect
                            onItemChange={item => setLoadoutSlot("bags2", item.id)}
                            selected={getLoadoutItemByName(loadoutItems["bags2"], bags)!}
                            options={bags}
                            loadoutSlotType="bags2"
                        />
                    </div>
                    <div className="loadoutSlot bag">
                        <LoadoutSelect
                            onItemChange={item => setLoadoutSlot("bags3", item.id)}
                            selected={getLoadoutItemByName(loadoutItems["bags3"], bags)!}
                            options={bags}
                            loadoutSlotType="bags3"
                        />
                    </div>
                    <div className="loadoutSlot bag">
                        <LoadoutSelect
                            onItemChange={item => setLoadoutSlot("bags4", item.id)}
                            selected={getLoadoutItemByName(loadoutItems["bags4"], bags)!}
                            options={bags}
                            loadoutSlotType="bags4"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
