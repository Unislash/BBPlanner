import './app.css';
import React from 'react';
import {AllPerks} from './components/PerkPlanner/AllPerks';
import {BuildName} from './components/Header/BuildName';
import {ResetPerks} from './components/PerkPlanner/ResetPerks';
import {MuiTheme} from './MuiTheme';
import {PerkPlannerInfo} from './components/Header/PerkPlannerInfo';
import {SaveButton} from './components/Header/SaveButton';
import {StatsForecast} from './components/StatsForecast/StatsForecast';
import {BuildList} from './components/BuildList/BuildList';
import {OtherResources} from './components/OtherResources/OtherResources';
import {ShareButton} from './components/Header/ShareButton';
import {ThemeSwitcher} from './components/ThemeSwitcher/ThemeSwitcher';
import {AppState, ThemeId} from './models';
import { connect } from 'react-redux';
import {NewBuildButton} from './components/Header/NewBuildButton';
import {InvalidBuildIndicator} from './components/Header/InvalidBuildIndicator';
import {Loadout} from './components/Loadout/Loadout';

interface AppProps {
    themeId: ThemeId;
}

export const AppBase: React.FC<AppProps> = ({themeId}) => (
    <MuiTheme>
        <div className="blanket"/>
        <div className={`appBackground ${themeId}`}/>
        <div className="content">
            <div className="mainPanel">
                <div className="header">
                    <h1 className="pageTitle">Battle Brothers Planner</h1>
                </div>
                {location.protocol === 'https:' && <p style={{marginTop: "-18px"}}>If you're looking for your saved builds, <a href="http://www.bbplanner.xyz" style={{textDecoration:"underline"}}>swap back to plain http</a>. BBPlanner doesn't share builds between https and http yet.</p>}
                <div className="perkPlanner">
                    <div className="plannerInfo">
                        <div className="leftInfo">
                            <NewBuildButton/>
                            <BuildName/>
                            <SaveButton/>
                            <ShareButton/>
                        </div>
                        <div className="rightInfo">
                            <InvalidBuildIndicator/>
                            <PerkPlannerInfo/>
                        </div>
                    </div>
                    <AllPerks/>
                    <ResetPerks/>
                </div>
                <StatsForecast/>
                <Loadout/>
            </div>
            <div className="rightPanel">
                <ThemeSwitcher/>
                <BuildList/>
                <OtherResources/>
            </div>
        </div>
    </MuiTheme>
);


const mapStateToProps = (state: AppState) => ({
    themeId: state.themeId,
});

export const App = connect(
    mapStateToProps,
)(AppBase);