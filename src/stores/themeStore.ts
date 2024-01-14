import { devtools } from "zustand/middleware";
import create from "zustand";
import {ThemeId} from '../models';
import {getThemeId, saveThemeId} from '../storageTheme';

export interface ThemeStore {
    themeId: ThemeId,
    actions: {
        setThemeId: (themeId: ThemeId) => void;
    }
}

const useThemeStore = create<ThemeStore>()(
    devtools(
        (set) => ({
            themeId: getThemeId(),
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

export const useThemeId = () => useThemeStore(state => state.themeId)
export const useThemeActions = () => useThemeStore(state => state.actions)
