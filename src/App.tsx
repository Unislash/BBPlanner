import "./app.css";
import React from "react";
import { MuiTheme } from "./MuiTheme";
import { BuildList } from "./planner/components/BuildList/BuildList";
import { BuildName } from "./planner/components/Header/BuildName";
import { InvalidBuildIndicator } from "./planner/components/Header/InvalidBuildIndicator";
import { NewBuildButton } from "./planner/components/Header/NewBuildButton";
import { PerkPlannerInfo } from "./planner/components/Header/PerkPlannerInfo";
import { SaveButton } from "./planner/components/Header/SaveButton";
import { ShareButton } from "./planner/components/Header/ShareButton";
import { Loadout } from "./planner/components/Loadout/Loadout";
import { OtherResources } from "./planner/components/OtherResources/OtherResources";
import { AllPerks } from "./planner/components/PerkPlanner/AllPerks";
import { ResetPerks } from "./planner/components/PerkPlanner/ResetPerks";
import { StatsForecast } from "./planner/components/StatsForecast/StatsForecast";
import { ThemeSwitcher } from "./planner/components/ThemeSwitcher/ThemeSwitcher";
import { useThemeId } from "./planner/stores/themeStore";
import { LegendaryPicker } from './legendaryRating/components/LegendaryPicker/LegendaryPicker';
import { Barkeep } from './legendaryRating/components/Barkeep/Barkeep';

export const App = (): JSX.Element => {
    const themeId = useThemeId();
    const showLegendaryTool =
        typeof window !== "undefined" && window.localStorage.getItem("legendaryRater") === "true";

    return (
        <MuiTheme>
            <div className="blanket" />
            <div className={`appBackground ${themeId}`} />
            <div className="content">
                {showLegendaryTool ? (
                    <>
                        <div className="barRoom">
                            <div className="header">
                                <h1 className="pageTitle">Legendary Rating</h1>
                            </div>
                            <Barkeep />
                            <LegendaryPicker />
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mainPanel">
                            <div className="header">
                                <h1 className="pageTitle">Battle Brothers Planner</h1>
                            </div>
                            <div className="perkPlanner">
                                <div className="plannerInfo">
                                    <div className="leftInfo">
                                        <NewBuildButton />
                                        <BuildName />
                                        <SaveButton />
                                        <ShareButton />
                                    </div>
                                    <div className="rightInfo">
                                        <InvalidBuildIndicator />
                                        <PerkPlannerInfo />
                                    </div>
                                </div>
                                <AllPerks />
                                <ResetPerks />
                            </div>
                            <StatsForecast />
                            <Loadout />
                        </div>
                        <div className="rightPanel">
                            <ThemeSwitcher />
                            <BuildList />
                            <OtherResources />
                        </div>
                    </>
                )}
            </div>
        </MuiTheme>
    );
};
