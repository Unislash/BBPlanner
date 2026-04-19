import { getLocalStorageObject, setLocalStorageObject } from "./storage";
import { defaultLegendaryThemeId, isLegendaryThemeId } from "./legendaryRating/themes";
import type { LegendaryThemeId } from "./legendaryRating/themes";

const legendaryThemeStorageKey = "legendaryThemeId";

export const saveLegendaryThemeId = (themeId: LegendaryThemeId) => {
    setLocalStorageObject(legendaryThemeStorageKey, themeId);
};

export const getLegendaryThemeId = (): LegendaryThemeId => {
    const storage = getLocalStorageObject<string>(legendaryThemeStorageKey);

    if (storage && isLegendaryThemeId(storage)) {
        return storage;
    }

    return defaultLegendaryThemeId;
};
