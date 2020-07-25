import './app.css';
import {Component} from 'react';
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

export class App extends Component {
    render() {
        return (
            <MuiTheme>
                <div className="blanket" />
                <div className="appBackground"/>
                <div className="content">
                    <div className="mainPanel">
                        <div className="header">
                            <h1 className="pageTitle">Battle Brothers Planner</h1>
                        </div>
                        <div className="perkPlanner">
                            <div className="plannerInfo">
                                <div className="leftInfo">
                                    <BuildName/>
                                    <SaveButton/>
                                    <ShareButton/>
                                </div>
                                <div className="rightInfo">
                                    <PerkPlannerInfo/>
                                </div>
                            </div>
                            <AllPerks/>
                            <ResetPerks/>
                        </div>
                        <StatsForecast />
                    </div>
                    <div className="rightPanel">
                        <BuildList />
                        <OtherResources />
                    </div>
                </div>
            </MuiTheme>
        );
    }
}
