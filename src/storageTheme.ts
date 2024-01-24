import { getLocalStorageObject, setLocalStorageObject } from "./storage";
import { ThemeId } from "./types/plannerModels";

export const saveThemeId = (themeId: ThemeId) => {
    setLocalStorageObject("themeId", themeId);
};

export const getThemeId = () => {
    const storage = getLocalStorageObject<ThemeId>("themeId");
    return storage || ThemeId.beastsAndExploration;
};
