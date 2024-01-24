import { ThemeId } from "./planner/types/plannerModels";
import { getLocalStorageObject, setLocalStorageObject } from "./storage";

export const saveThemeId = (themeId: ThemeId) => {
    setLocalStorageObject("themeId", themeId);
};

export const getThemeId = () => {
    const storage = getLocalStorageObject<ThemeId>("themeId");
    return storage || ThemeId.beastsAndExploration;
};
