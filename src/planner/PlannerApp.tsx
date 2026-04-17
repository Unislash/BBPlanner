import "../shared.css";
import "../planner.css";
import React, { useEffect } from "react";
import { MuiTheme } from "../MuiTheme";
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
import { redoPlannerHistory, undoPlannerHistory } from "./stores/historyStore";
import { ThemeSwitcher } from "./components/ThemeSwitcher/ThemeSwitcher";
import { useThemeId } from "./stores/themeStore";

export const PlannerApp = (): JSX.Element => {
    const themeId = useThemeId();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const hasPrimaryModifier = event.ctrlKey || event.metaKey;
            if (!hasPrimaryModifier || event.altKey) {
                return;
            }

            const lowerCaseKey = event.key.toLowerCase();
            const isUndoHotkey = lowerCaseKey === "z" && !event.shiftKey;
            const isRedoHotkey = lowerCaseKey === "y" || (lowerCaseKey === "z" && event.shiftKey);

            if (!isUndoHotkey && !isRedoHotkey) {
                return;
            }

            const wasHandled = isUndoHotkey ? undoPlannerHistory() : redoPlannerHistory();
            if (wasHandled) {
                event.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <MuiTheme>
            <div className="blanket" />
            <div className={`appBackground ${themeId}`} />
            <div className="content">
                <div className="mainPanel">
                    <header className="plannerHeader">
                        <h1 className="pageTitle">Battle Brothers Planner</h1>
                    </header>
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
