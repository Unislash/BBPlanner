import "./app.css";
import React from "react";
import { MuiTheme } from "./MuiTheme";
import { BuildList } from "./components/BuildList/BuildList";
import { BuildName } from "./components/Header/BuildName";
import { InvalidBuildIndicator } from "./components/Header/InvalidBuildIndicator";
import { NewBuildButton } from "./components/Header/NewBuildButton";
import { PerkPlannerInfo } from "./components/Header/PerkPlannerInfo";
import { SaveButton } from "./components/Header/SaveButton";
import { ShareButton } from "./components/Header/ShareButton";
import { Loadout } from "./components/Loadout/Loadout";
import { OtherResources } from "./components/OtherResources/OtherResources";
import { AllPerks } from "./components/PerkPlanner/AllPerks";
import { ResetPerks } from "./components/PerkPlanner/ResetPerks";
import { StatsForecast } from "./components/StatsForecast/StatsForecast";
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";
import { useThemeId } from "./stores/themeStore";

export const App = (): JSX.Element => {
    const themeId = useThemeId();

    return (
        <MuiTheme>
            <div className="blanket" />
            <div className={`appBackground ${themeId}`} />
            <div className="content">
                <div className="mainPanel">
                    <div className="header">
                        <h1 className="pageTitle">Battle Brothers Planner</h1>
                    </div>
                    {location.protocol === "https:" && (
                        <p style={{ marginTop: "-18px" }}>
                            If you're looking for your saved builds,{" "}
                            <a href="http://www.bbplanner.xyz" style={{ textDecoration: "underline" }}>
                                swap back to plain http
                            </a>
                            . BBPlanner doesn't share builds between https and http yet.
                        </p>
                    )}
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
            </div>
        </MuiTheme>
    );
};
