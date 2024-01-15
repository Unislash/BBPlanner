import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import create from "zustand/vanilla";
import shallow from 'zustand/shallow'
import {LoadoutItems, LoadoutSlotType} from '../models';
import {getNewLoadoutItems} from '../initialState';

export interface LoadoutStore {
    loadoutItems: LoadoutItems;
    actions: {
        setLoadoutSlot: (loadoutSlot: LoadoutSlotType, itemName: string) => void;
        setLoadoutItems: (loadoutItems: LoadoutItems) => void;
    }
}

export const initialLoadoutStore = {
    loadoutItems: getNewLoadoutItems(),
}

export const loadoutStore = create<LoadoutStore>()(
    devtools(
        (set) => ({
            ...initialLoadoutStore,
            actions: {
                setLoadoutSlot: (loadoutSlot: LoadoutSlotType, itemName: string) => set(state => {
                    const newState = {
                        loadoutItems: {
                            ...state.loadoutItems,
                            [loadoutSlot]: itemName,
                        },
                    };

                    // saveToURL({
                    //     ...newState,
                    //     statNums: statsStore.getState().statNums,
                    //     activePerkIds: perkStore.getState().activePerkIds,
                    //     stars: starsStore.getState().stars,
                    // });
                    // updateStorageForCurrentBuild(newState);

                    return newState;
                }),
                setLoadoutItems: (loadoutItems: LoadoutItems) => set({loadoutItems}),
            }
        }),

        { name: "LoadoutStore", trace: true }
    )
);

export const useLoadoutItems = () => useStore(loadoutStore, state => state.loadoutItems, shallow);
export const useLoadoutActions = () => useStore(loadoutStore, state => state.actions)