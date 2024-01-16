import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import {createStore} from "zustand/vanilla";
import {shallow} from 'zustand/shallow'
import {LoadoutItems, LoadoutSlotType} from '../models';
import {getNewLoadoutItems} from './initialState';
import {saveToURL} from '../url';
import {updateStorageForCurrentBuild} from '../storage';

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

export const loadoutStore = createStore<LoadoutStore>()(
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

                    saveToURL(newState);
                    updateStorageForCurrentBuild();

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