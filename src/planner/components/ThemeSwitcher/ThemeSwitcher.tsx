import * as React from "react";
import { useThemeActions, useThemeId } from "../../stores/themeStore";
import { ThemeId } from "../../types/models";
import { ThemeButton } from "./ThemeButton";

export const ThemeSwitcher = (): JSX.Element => {
    const themeId = useThemeId();
    const { setThemeId } = useThemeActions();

    return (
        <div className="themeSwitcher">
            <ThemeButton themeId={ThemeId.vanilla} activeThemeId={themeId} setThemeId={setThemeId} />
            <ThemeButton themeId={ThemeId.beastsAndExploration} activeThemeId={themeId} setThemeId={setThemeId} />
            <ThemeButton themeId={ThemeId.warriorsOfTheNorth} activeThemeId={themeId} setThemeId={setThemeId} />
            <ThemeButton themeId={ThemeId.blazingDeserts} activeThemeId={themeId} setThemeId={setThemeId} />
            <ThemeButton themeId={ThemeId.ofFleshAndFaith} activeThemeId={themeId} setThemeId={setThemeId} />
        </div>
    );
};
