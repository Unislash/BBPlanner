import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import create from "zustand/vanilla";
import shallow from 'zustand/shallow'
import {StatNums, StatType} from '../models';
import {getNewStatNums} from './initialState';

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

export const statsStore = create<StatsStore>()(
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

                    // TODO saveToURL
                    // saveToURL({
                    //     ...newState,
                    // });
                    // updateStorageForCurrentBuild(newState);

                    return newState;
                }),
                setStatNums: (statNums: StatNums) => set({statNums}),
                resetStatNums: () => set(state => {
                    const newState = {
                        statNums: getNewStatNums(),
                    };

                    // TODO saveToURL
                    // saveToURL({
                    //     ...newState,
                    // });
                    // updateStorageForCurrentBuild(newState);

                    return newState;
                }),
            }
        }),

        { name: "StatsStore", trace: true }
    )
);

export const useStatNums = () => useStore(statsStore, state => state.statNums, shallow);
export const useStatsActions = () => useStore(statsStore, state => state.actions)