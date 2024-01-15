import { devtools } from "zustand/middleware";
import { useStore } from "zustand";
import create from "zustand/vanilla";
import {ThemeId} from '../models';
import {getThemeId, saveThemeId} from '../storageTheme';

export interface ThemeStore {
    themeId: ThemeId,
    actions: {
        setThemeId: (themeId: ThemeId) => void;
    }
}

export const initialThemeStore = {
    themeId: getThemeId(),
}

export const themeStore = create<ThemeStore>()(
    devtools(
        (set) => ({
            ...initialThemeStore,
            actions: {
                setThemeId: (themeId: ThemeId) => set(state => {
                    saveThemeId(themeId);
                    return {themeId};
                })
            }
        }),

        { name: "ThemeStore", trace: true }
    )
);

export const useThemeId = () => useStore(themeStore, state => state.themeId)
export const useThemeActions = () => useStore(themeStore, state => state.actions)
