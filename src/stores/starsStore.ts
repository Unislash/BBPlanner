import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import { updateStorageForCurrentBuild } from "../storage";
import { Stars, StatType } from "../types/plannerModels";
import { saveToURL } from "../url";
import { getNewStars } from "./initialState";

export interface StarsStore {
    actions: {
        resetStars: () => void;
        setStar: (statType: StatType, amount: number) => void;
        setStars: (stars: Stars) => void;
    };
    stars: Stars;
}

export const initialStarsStore = {
    stars: getNewStars(),
};

export const starsStore = createStore<StarsStore>()(
    devtools(
        (set) => ({
            ...initialStarsStore,
            actions: {
                setStar: (statType: StatType, amount: number) =>
                    set((state) => {
                        const newStars = {
                            ...state.stars,
                        };
                        newStars[statType] = amount; // modify in-place to retain object attribute order

                        const newState = {
                            stars: newStars,
                        };

                        saveToURL(newState);
                        updateStorageForCurrentBuild();

                        return newState;
                    }),
                setStars: (stars: Stars) => set({ stars }),
                resetStars: () =>
                    set(() => {
                        const newState = {
                            stars: getNewStars(),
                        };

                        saveToURL(newState);
                        updateStorageForCurrentBuild();

                        return newState;
                    }),
            },
        }),

        { name: "StarsStore", trace: true },
    ),
);

export const useStars = () => useStore(starsStore, (state) => state.stars, shallow);
export const useStarsActions = () => useStore(starsStore, (state) => state.actions);
