import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import create from "zustand/vanilla";
import shallow from 'zustand/shallow'
import {getAvailableNumberOfPerks, maxLevel} from '../logic';

export interface PerkStore {
    activePerkIds: string[],
    isStudent: boolean,
    actions: {
        togglePerk: (perkId: string) => void;
        setStudent: (isStudent: boolean) => void;
        setPerks: (activePerkIds: string[]) => void;
        resetPerks: () => void;
    }
}

export const initialPerkStore = {
    activePerkIds: [],
    isStudent: false,
}

export const perkStore = create<PerkStore>()(
    devtools(
        (set) => ({
            ...initialPerkStore,
            actions: {
                togglePerk: (perkId: string) => set(state => {
                    let newState = {activePerkIds: state.activePerkIds, isStudent: state.isStudent};

                    if (state.activePerkIds.indexOf(perkId) > -1) {
                        // It exists, so remove it
                        newState.activePerkIds = [...state.activePerkIds].filter(item => item !== perkId);
                        if (perkId === "student") {
                            newState.isStudent = false;
                        }
                    } else {
                        // It doesn't exist, so try to add it
                        if (perkId === "student" || getAvailableNumberOfPerks(state.activePerkIds.length, maxLevel, state.isStudent) >= 1) {
                            newState.activePerkIds = [...state.activePerkIds, perkId];
                            if (perkId === "student") {
                                newState.isStudent = true;
                            }
                        } else {
                            // do nothing; there are no available perks left
                        }
                    }
                    // TODO saveToURL
                    // saveToURL({
                    //     newState
                    // });
                    // updateStorageForCurrentBuild(newState);

                    return newState
                }),
                setStudent: (isStudent: boolean) => set({isStudent}),
                setPerks: (activePerkIds: string[]) => set({activePerkIds}),
                resetPerks: () => set(state => {
                    // Don't save! To avoid accidental resets, wait for the user to pick their first perk to save
                    // saveToURL(newState, true);
                    // updateStorageForCurrentBuild(newState);

                    return {
                        activePerkIds: [],
                        isStudent: false,
                    };
                }),
            }
        }),

        { name: "PerkStore", trace: true }
    )
);

export const useActivePerkIds = () => useStore(perkStore, state => state.activePerkIds, shallow);
export const useIsStudent = () => useStore(perkStore, state => state.isStudent);
export const useCanAddPerk = () => useStore(perkStore, state => getAvailableNumberOfPerks(state.activePerkIds.length, maxLevel, state.isStudent) >= 1);
export const usePerkActions = () => useStore(perkStore, state => state.actions)