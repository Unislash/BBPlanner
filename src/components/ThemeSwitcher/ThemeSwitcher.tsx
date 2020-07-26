import * as React from 'react';
import {AppState, ThemeId} from '../../models';
import {setThemeId} from '../../actions';
import { connect } from 'react-redux';
import {ThemeButton} from './ThemeButton';

interface ThemeSwitcherProps {
    themeId: ThemeId;
    setThemeId: (themeId: ThemeId) => void;
}

export const ThemeSwitcherBase: React.FC<ThemeSwitcherProps> = ({
    themeId,
    setThemeId,
}) => {
    return (
        <div className="themeSwitcher">
            <ThemeButton themeId={ThemeId.vanilla} activeThemeId={themeId} setThemeId={setThemeId}/>
            <ThemeButton themeId={ThemeId.beastsAndExploration} activeThemeId={themeId} setThemeId={setThemeId}/>
            <ThemeButton themeId={ThemeId.warriorsOfTheNorth} activeThemeId={themeId} setThemeId={setThemeId}/>
            <ThemeButton themeId={ThemeId.blazingDeserts} activeThemeId={themeId} setThemeId={setThemeId}/>
        </div>
    );
}

const mapStateToProps = (state: AppState) => ({
    themeId: state.themeId,
});

const mapDispatchToProps = {
    setThemeId,
};

export const ThemeSwitcher = connect(
    mapStateToProps,
    mapDispatchToProps,
)(ThemeSwitcherBase);