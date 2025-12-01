import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { shallow } from "zustand/shallow";
import { createStore } from "zustand/vanilla";
import { ArchetypeId, LegendaryStatInputType } from '../types/models';
import { LegendaryItemImageMap } from '../components/LegendaryPicker/ArchetypeGridItem';

export interface LegendaryStore {
    actions: {
        setSelectedArchetypeId: (archetypeId: ArchetypeId | null) => void;
        setLegendaryStat: (LegendaryStat: LegendaryStatInputType, value: number) => void;
        setLegendaryItemImageMap: (legendaryImageMap: LegendaryItemImageMap) => void;
    };
    selectedArchetypeId: ArchetypeId | null;
    legendaryStats: Partial<Record<LegendaryStatInputType, number>>;
    legendaryImageMap?: LegendaryItemImageMap;
}

export const initialLegendaryStore = {
    selectedArchetypeId: null,
    legendaryImageMap: undefined,
    legendaryStats: {
        durability: 0,
        fatigue: 0,
    },
};

export const legendaryStore = createStore<LegendaryStore>()(
    devtools(
        (set) => ({
            ...initialLegendaryStore,
            actions: {
                setSelectedArchetypeId: (archetypeId: ArchetypeId | null) => set({ selectedArchetypeId: archetypeId }),
                setLegendaryStat: (LegendaryStat: LegendaryStatInputType, value: number) => set({legendaryStats: {[LegendaryStat]: value}}),
                setLegendaryItemImageMap: (legendaryImageMap: LegendaryItemImageMap) => set({ legendaryImageMap }),
            },
        }),

        { name: "LegendaryStore", trace: true },
    ),
);

export const useSelectedArchetypeId = () => useStore(legendaryStore, (state) => state.selectedArchetypeId, shallow);
export const useLegendaryStats = () => useStore(legendaryStore, (state) => state.legendaryStats);
export const useLegendaryImageMap = () => useStore(legendaryStore, (state) => state.legendaryImageMap);
export const useLegendaryActions = () => useStore(legendaryStore, (state) => state.actions);
