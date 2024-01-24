import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import { updateStorageForCurrentBuild } from "../../storage";
import { saveToURL } from "../../url";
import { LoadoutItems, LoadoutSlotType } from "../types/plannerModels";
import { getNewLoadoutItems } from "./initialState";

export interface LoadoutStore {
    actions: {
        setLoadoutItems: (loadoutItems: LoadoutItems) => void;
        setLoadoutSlot: (loadoutSlot: LoadoutSlotType, itemName: string) => void;
    };
    loadoutItems: LoadoutItems;
}

export const initialLoadoutStore = {
    loadoutItems: getNewLoadoutItems(),
};

export const loadoutStore = createStore<LoadoutStore>()(
    devtools(
        (set) => ({
            ...initialLoadoutStore,
            actions: {
                setLoadoutSlot: (loadoutSlot: LoadoutSlotType, itemName: string) =>
                    set((state) => {
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
                setLoadoutItems: (loadoutItems: LoadoutItems) => set({ loadoutItems }),
            },
        }),

        { name: "LoadoutStore", trace: true },
    ),
);

export const useLoadoutItems = () => useStore(loadoutStore, (state) => state.loadoutItems, shallow);
export const useLoadoutActions = () => useStore(loadoutStore, (state) => state.actions);
