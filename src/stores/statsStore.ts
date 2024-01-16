import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import {createStore} from "zustand/vanilla";
import {shallow} from 'zustand/shallow'
import {StatNums, StatType} from '../models';
import {getNewStatNums} from './initialState';
import {saveToURL} from '../url';
import {updateStorageForCurrentBuild} from '../storage';

export interface StatsStore {
    statNums: StatNums;
    actions: {
        setStat: (statType: StatType, num: number) => void;
        setStatNums: (statNums: StatNums) => void;
        resetStatNums: () => void;
    }
}

export const initialStatsStore = {
    statNums: getNewStatNums(),
}

export const statsStore = createStore<StatsStore>()(
    devtools(
        (set) => ({
            ...initialStatsStore,
            actions: {
                setStat: (statType: StatType, num: number) => set(state => {
                    const newStatNums = {
                        ...state.statNums,
                    };
                    newStatNums[statType] = num; // modify in-place to retain object attribute order

                    const newState = {
                        statNums: newStatNums
                    }

                    saveToURL(newState);
                    updateStorageForCurrentBuild();

                    return newState;
                }),
                setStatNums: (statNums: StatNums) => set({statNums}),
                resetStatNums: () => set(state => {
                    const newState = {
                        statNums: getNewStatNums(),
                    };

                    saveToURL(newState);
                    updateStorageForCurrentBuild();

                    return newState;
                }),
            }
        }),

        { name: "StatsStore", trace: true }
    )
);

export const useStatNums = () => useStore(statsStore, state => state.statNums, shallow);
export const useStatsActions = () => useStore(statsStore, state => state.actions)