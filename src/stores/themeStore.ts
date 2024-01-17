import { useStore } from "zustand";
import { devtools } from "zustand/middleware";
import { createStore } from "zustand/vanilla";
import { ThemeId } from "../models";
import { getThemeId, saveThemeId } from "../storageTheme";

export interface ThemeStore {
    actions: {
        setThemeId: (themeId: ThemeId) => void;
    };
    themeId: ThemeId;
}

export const initialThemeStore = {
    themeId: getThemeId(),
};

export const themeStore = createStore<ThemeStore>()(
    devtools(
        (set) => ({
            ...initialThemeStore,
            actions: {
                setThemeId: (themeId: ThemeId) =>
                    set(() => {
                        saveThemeId(themeId);
                        return { themeId };
                    }),
            },
        }),

        { name: "ThemeStore", trace: true },
    ),
);

export const useThemeId = () => useStore(themeStore, (state) => state.themeId);
export const useThemeActions = () => useStore(themeStore, (state) => state.actions);
