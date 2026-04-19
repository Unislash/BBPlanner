import "../shared.css";
import "../legendary.css";
import classcat from "classcat";
import React, { useEffect, useRef, useState } from "react";
import { MuiTheme } from "../MuiTheme";
import { Barkeep } from "./components/Barkeep/Barkeep";
import { LegendaryPicker } from "./components/LegendaryPicker/LegendaryPicker";
import { LegendaryThemeSwitcher } from "./components/ThemeSwitcher/LegendaryThemeSwitcher";
import { useLegendaryActions, useLegendaryStats, useSelectedArchetypeId, useSelectedCategoryId } from "./stores/legendaryStore";
import { legendaryThemes } from "./themes";
import { saveLegendaryToURL } from "./url";
import { getLegendaryThemeId, saveLegendaryThemeId } from "../storageLegendaryTheme";

export const LegendaryApp = (): JSX.Element => {
    const selectedCategoryId = useSelectedCategoryId();
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const { setSelectedCategoryId } = useLegendaryActions();
    const previousArchetypeId = useRef(selectedArchetypeId);
    const [selectedThemeId, setSelectedThemeId] = useState(getLegendaryThemeId);
    const selectedTheme = legendaryThemes[selectedThemeId];

    useEffect(() => {
        const shouldCreateHistoryEntry = previousArchetypeId.current !== selectedArchetypeId;
        saveLegendaryToURL({
            selectedArchetypeId,
            legendaryStats,
            shouldCreateHistoryEntry,
        });
        previousArchetypeId.current = selectedArchetypeId;
    }, [legendaryStats, selectedArchetypeId]);

    useEffect(() => {
        saveLegendaryThemeId(selectedThemeId);
    }, [selectedThemeId]);

    return (
        <MuiTheme>
            <div
                className={classcat(["appBackground", selectedTheme.modifierClassName])}
                style={selectedTheme.backgroundImage ? { backgroundImage: `url(${selectedTheme.backgroundImage})` } : undefined}
            />
            <div className="content">
                <div className="barRoom">
                    <div className="legendaryToolbar">
                        <LegendaryThemeSwitcher activeThemeId={selectedThemeId} setThemeId={setSelectedThemeId} />
                    </div>
                    <Barkeep categoryId={selectedCategoryId} avatarImage={selectedTheme.avatarImage} themeId={selectedThemeId} />
                    <LegendaryPicker
                        selectedCategoryId={selectedCategoryId}
                        setSelectedCategoryId={setSelectedCategoryId}
                    />
                </div>
            </div>
        </MuiTheme>
    );
};
