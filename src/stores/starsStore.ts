import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import create from "zustand/vanilla";
import shallow from 'zustand/shallow'
import {Stars, StatType} from '../models';
import {getNewStars} from '../initialState';

export interface StarsStore {
    stars: Stars;
    actions: {
        setStar: (statType: StatType, amount: number) => void;
        setStars: (stars: Stars) => void;
        resetStars: () => void;
    }
}

export const initialStarsStore = {
    stars: getNewStars(),
}

export const starsStore = create<StarsStore>()(
    devtools(
        (set) => ({
            ...initialStarsStore,
            actions: {
                setStar: (statType: StatType, amount: number) => set(state => {
                    const newStars = {
                        ...state.stars,
                    };
                    newStars[statType] = amount; // modify in-place to retain object attribute order

                    const newState = {
                        stars: newStars,
                    };

                    // TODO saveToURL
                    // saveToURL({
                    //     ...newState,
                    //     statNums: statsStore.getState().statNums,
                    //     activePerkIds: perkStore.getState().activePerkIds,
                    // });
                    // updateStorageForCurrentBuild(newState);

                    return newState;
                }),
                setStars: (stars: Stars) => set({stars}),
                resetStars: () => set(state => {
                    const newState = {
                        stars: getNewStars(),
                    };

                    // TODO saveToURL
                    // saveToURL({
                    //     ...newState,
                    //     statNums: statsStore.getState().statNums,
                    //     activePerkIds: perkStore.getState().activePerkIds,
                    // });
                    // updateStorageForCurrentBuild(newState);

                    return newState;
                }),
            }
        }),

        { name: "StarsStore", trace: true }
    )
);

export const useStars = () => useStore(starsStore, state => state.stars, shallow);
export const useStarsActions = () => useStore(starsStore, state => state.actions)