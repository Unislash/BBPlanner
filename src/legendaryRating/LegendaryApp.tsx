import "../shared.css";
import "../legendary.css";
import React, { useEffect, useRef } from "react";
import { MuiTheme } from "../MuiTheme";
import { Barkeep } from "./components/Barkeep/Barkeep";
import { LegendaryPicker } from "./components/LegendaryPicker/LegendaryPicker";
import { useLegendaryActions, useLegendaryStats, useSelectedArchetypeId, useSelectedCategoryId } from "./stores/legendaryStore";
import { saveLegendaryToURL } from "./url";

export const LegendaryApp = (): JSX.Element => {
    const selectedCategoryId = useSelectedCategoryId();
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const { setSelectedCategoryId } = useLegendaryActions();
    const previousArchetypeId = useRef(selectedArchetypeId);

    useEffect(() => {
        const shouldCreateHistoryEntry = previousArchetypeId.current !== selectedArchetypeId;
        saveLegendaryToURL({
            selectedArchetypeId,
            legendaryStats,
            shouldCreateHistoryEntry,
        });
        previousArchetypeId.current = selectedArchetypeId;
    }, [legendaryStats, selectedArchetypeId]);

    return (
        <MuiTheme>
            <div className="appBackground" />
            <div className="content">
                <div className="barRoom">
                    <Barkeep categoryId={selectedCategoryId} />
                    <LegendaryPicker
                        selectedCategoryId={selectedCategoryId}
                        setSelectedCategoryId={setSelectedCategoryId}
                    />
                </div>
            </div>
        </MuiTheme>
    );
};
