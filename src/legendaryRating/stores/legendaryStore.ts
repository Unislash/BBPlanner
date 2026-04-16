import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import type { ArchetypeId, LegendaryStatInputType } from "../types/models";

export interface LegendaryStore {
    actions: {
        resetLegendaryStats: () => void;
        setSelectedArchetypeId: (archetypeId: ArchetypeId | null) => void;
        setLegendaryStat: (LegendaryStat: LegendaryStatInputType, value: number) => void;
        setLegendaryStats: (legendaryStats: Partial<Record<LegendaryStatInputType, number>>) => void;
    };
    selectedArchetypeId: ArchetypeId | null;
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>;
}

export const initialLegendaryStore = {
    selectedArchetypeId: null,
    legendaryStats: {},
};

export const legendaryStore = createStore<LegendaryStore>()(
    devtools(
        (set) => ({
            ...initialLegendaryStore,
            actions: {
                resetLegendaryStats: () => set({ legendaryStats: {} }),
                setSelectedArchetypeId: (archetypeId: ArchetypeId | null) => set({ selectedArchetypeId: archetypeId }),
                setLegendaryStat: (LegendaryStat: LegendaryStatInputType, value: number) =>
                    set((state) => ({ legendaryStats: { ...state.legendaryStats, [LegendaryStat]: value } })),
                setLegendaryStats: (legendaryStats: Partial<Record<LegendaryStatInputType, number>>) =>
                    set({ legendaryStats }),
            },
        }),

        { name: "LegendaryStore", trace: true },
    ),
);

export const useSelectedArchetypeId = () => useStore(legendaryStore, (state) => state.selectedArchetypeId, shallow);
export const useLegendaryStats = () => useStore(legendaryStore, (state) => state.legendaryStats);
export const useLegendaryActions = () => useStore(legendaryStore, (state) => state.actions);
