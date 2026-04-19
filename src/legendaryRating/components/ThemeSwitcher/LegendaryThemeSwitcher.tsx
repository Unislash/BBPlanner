import * as React from "react";
import classcat from "classcat";
import { legendaryThemeIds, legendaryThemes } from "../../themes";
import type { LegendaryThemeId } from "../../themes";

interface LegendaryThemeSwitcherProps {
    activeThemeId: LegendaryThemeId;
    setThemeId: (themeId: LegendaryThemeId) => void;
}

export const LegendaryThemeSwitcher = ({
    activeThemeId,
    setThemeId,
}: LegendaryThemeSwitcherProps): JSX.Element => {
    return (
        <div className="legendaryThemeSwitcher" aria-label="Legendary themes" role="group">
            {legendaryThemeIds.map((themeId) => {
                const theme = legendaryThemes[themeId];

                return (
                    <button
                        key={theme.id}
                        type="button"
                        className={classcat([
                            "legendaryThemeButton",
                            theme.modifierClassName,
                            { isActive: theme.id === activeThemeId, hasImage: !!theme.buttonImage },
                        ])}
                        onClick={() => setThemeId(theme.id)}
                        aria-label={`Switch to ${theme.label} theme`}
                        title={theme.label}
                        style={theme.buttonImage ? { backgroundImage: `url(${theme.buttonImage})` } : undefined}
                    />
                );
            })}
        </div>
    );
};
