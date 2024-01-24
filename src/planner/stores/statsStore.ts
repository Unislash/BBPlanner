import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import { updateStorageForCurrentBuild } from "../../storage";
import { saveToURL } from "../../url";
import { StatNums, StatType } from "../types/plannerModels";
import { getNewStatNums } from "./initialState";

export interface StatsStore {
    actions: {
        resetStatNums: () => void;
        setStat: (statType: StatType, num: number) => void;
        setStatNums: (statNums: StatNums) => void;
    };
    statNums: StatNums;
}

export const initialStatsStore = {
    statNums: getNewStatNums(),
};

export const statsStore = createStore<StatsStore>()(
    devtools(
        (set) => ({
            ...initialStatsStore,
            actions: {
                setStat: (statType: StatType, num: number) =>
                    set((state) => {
                        const newStatNums = {
                            ...state.statNums,
                        };
                        newStatNums[statType] = num; // modify in-place to retain object attribute order

                        const newState = {
                            statNums: newStatNums,
                        };

                        saveToURL(newState);
                        updateStorageForCurrentBuild();

                        return newState;
                    }),
                setStatNums: (statNums: StatNums) => set({ statNums }),
                resetStatNums: () =>
                    set(() => {
                        const newState = {
                            statNums: getNewStatNums(),
                        };

                        saveToURL(newState);
                        updateStorageForCurrentBuild();

                        return newState;
                    }),
            },
        }),

        { name: "StatsStore", trace: true },
    ),
);

export const useStatNums = () => useStore(statsStore, (state) => state.statNums, shallow);
export const useStatsActions = () => useStore(statsStore, (state) => state.actions);
