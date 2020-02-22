import './app.css';
import {Component} from 'react';
import React from 'react';
import {AllPerks} from './components/AllPerks';
import {BuildName} from './components/BuildName';
import {ResetPerks} from './components/ResetPerks';
import {MuiTheme} from './MuiTheme';
import {PerkPlannerInfo} from './components/PerkPlannerInfo';
import {ShareButton} from './components/ShareButton';

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
                    <div className="statsPlanner">
                        Stats Planner
                    </div>
                </div>
            </MuiTheme>
        );
    }
}
