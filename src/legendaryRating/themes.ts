import barkeepAvatarTavern from "./images/barkeep-avatar_resized_levels_nowarm_optimized.webp";
import patronAvatar from "./images/patron.webp";
import tavernBackgroundTavern from "./images/tavern-table_v2-2_1920_optimized.webp";

export const legendaryThemeIds = ["tavern", "classic"] as const;

export type LegendaryThemeId = (typeof legendaryThemeIds)[number];

export interface LegendaryTheme {
    avatarImage?: string;
    backgroundImage?: string;
    buttonImage?: string;
    modifierClassName: string;
    id: LegendaryThemeId;
    label: string;
}

export const defaultLegendaryThemeId: LegendaryThemeId = "tavern";

export const legendaryThemes: Record<LegendaryThemeId, LegendaryTheme> = {
    tavern: {
        id: "tavern",
        label: "Tavern",
        modifierClassName: "legendaryTheme_tavern",
        backgroundImage: tavernBackgroundTavern,
        avatarImage: barkeepAvatarTavern,
        buttonImage: barkeepAvatarTavern,
    },
    classic: {
        id: "classic",
        label: "Embers",
        modifierClassName: "legendaryTheme_classic",
        avatarImage: patronAvatar,
        buttonImage: patronAvatar,
    },
};

export const isLegendaryThemeId = (value: string): value is LegendaryThemeId => {
    return legendaryThemeIds.includes(value as LegendaryThemeId);
};
