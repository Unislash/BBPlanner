import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import type { ArchetypeId, CategoryId, LegendaryStatInputType } from "../types/models";

export interface LegendaryStore {
    actions: {
        resetLegendaryStats: () => void;
        setSelectedArchetypeId: (archetypeId: ArchetypeId | null) => void;
        setSelectedCategoryId: (categoryId: CategoryId) => void;
        setLegendaryStat: (LegendaryStat: LegendaryStatInputType, value: number) => void;
        setLegendaryStats: (legendaryStats: Partial<Record<LegendaryStatInputType, number>>) => void;
    };
    selectedCategoryId: CategoryId;
    selectedArchetypeId: ArchetypeId | null;
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>;
}

export const initialLegendaryStore = {
    selectedCategoryId: "oneHanded" as CategoryId,
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
                setSelectedCategoryId: (categoryId: CategoryId) => set({ selectedCategoryId: categoryId }),
                setLegendaryStat: (LegendaryStat: LegendaryStatInputType, value: number) =>
                    set((state) => ({ legendaryStats: { ...state.legendaryStats, [LegendaryStat]: value } })),
                setLegendaryStats: (legendaryStats: Partial<Record<LegendaryStatInputType, number>>) =>
                    set({ legendaryStats }),
            },
        }),

        { name: "LegendaryStore", trace: true },
    ),
);

export const useSelectedCategoryId = () => useStore(legendaryStore, (state) => state.selectedCategoryId);
export const useSelectedArchetypeId = () => useStore(legendaryStore, (state) => state.selectedArchetypeId, shallow);
export const useLegendaryStats = () => useStore(legendaryStore, (state) => state.legendaryStats);
export const useLegendaryActions = () => useStore(legendaryStore, (state) => state.actions);
