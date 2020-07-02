import './app.css';
import {Component} from 'react';
import React from 'react';
import {AllPerks} from './components/PerkPlanner/AllPerks';
import {BuildName} from './components/Header/BuildName';
import {ResetPerks} from './components/PerkPlanner/ResetPerks';
import {MuiTheme} from './MuiTheme';
import {PerkPlannerInfo} from './components/Header/PerkPlannerInfo';
import {ShareButton} from './components/Header/ShareButton';
import {StatsPlanner} from './components/StatsPlanner/StatsPlanner';

export class App extends Component {
    render() {
        return (
            <MuiTheme>
                <div className="appBackground"/>
                <div className="header">
                    <h1 className="pageTitle">Battle Brothers Planner</h1>
                </div>
                <div className="content">
                    <div className="perkPlanner">
                        <div className="plannerInfo">
                            <div className="leftInfo">
                                <BuildName/>
                                <ShareButton/>
                            </div>
                            <div className="rightInfo">
                                <PerkPlannerInfo/>
                            </div>
                        </div>
                        <AllPerks/>
                        <ResetPerks/>
                    </div>
                    <StatsPlanner />
                </div>
            </MuiTheme>
        );
    }
}
