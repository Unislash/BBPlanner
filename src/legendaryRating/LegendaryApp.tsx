import "../shared.css";
import "../legendary.css";
import React, { useState } from "react";
import { MuiTheme } from "../MuiTheme";
import { Barkeep } from "./components/Barkeep/Barkeep";
import { LegendaryPicker } from "./components/LegendaryPicker/LegendaryPicker";
import type { CategoryId } from "./types/models";

export const LegendaryApp = (): JSX.Element => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>("oneHanded");

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
