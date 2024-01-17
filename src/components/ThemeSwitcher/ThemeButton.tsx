import classcat from 'classcat';
import Tooltip from 'rc-tooltip';
import * as React from 'react';
import {ThemeId} from '../../models';

interface ThemeButtonProps {
    activeThemeId: ThemeId;
    setThemeId: (themeId: ThemeId) => void;
    themeId: ThemeId;
}

const getText = (themeId: ThemeId) => {
    switch (themeId) {
        case ThemeId.vanilla:
            return "Vanilla Theme";
        case ThemeId.beastsAndExploration:
            return "Beasts and Exploration Theme";
        case ThemeId.warriorsOfTheNorth:
            return "Warriors of the North Theme";
        case ThemeId.blazingDeserts:
            return "Blazing Deserts Theme";
        case ThemeId.ofFleshAndFaith:
            return "Of Flesh and Faith Theme";
    }
}

export const ThemeButton: React.FC<ThemeButtonProps> = ({
    themeId,
    activeThemeId,
    setThemeId,
}) => {
    return (
        <Tooltip
            overlay={getText(themeId)}
            placement="bottom"
            mouseEnterDelay={.3}
        >
            <div
                className={classcat(["themeButton", themeId, {isActive: themeId === activeThemeId}])}
                onClick={() => setThemeId(themeId)}
            />
        </Tooltip>
    );
}