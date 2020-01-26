import './app.css';
import {Component} from 'react';
import React from 'react';
import {AllPerks} from './components/AllPerks';
import {BuildName} from './components/BuildName';

export class App extends Component {
    render() {
        return (
            <>
                <div className="appBackground"/>
                <div className="header">
                    <h1 className="pageTitle">Battle Brothers Planner</h1>
                </div>
                <div className="content">
                    <div className="perkPlanner">
                        <div className="plannerInfo">
                            <div className="leftInfo">
                                <BuildName />
                            </div>
                            <div className="rightInfo">
                                <h3 className="requiredLevel">Level Required: {11}</h3>
                                <h3 className="perksRemaining">Remaining Perks: {0}</h3>
                            </div>
                        </div>
                        <AllPerks/>
                    </div>
                    <div className="statsPlanner">
                        Stats Planner
                    </div>
                </div>
            </>
        );
    }
}
