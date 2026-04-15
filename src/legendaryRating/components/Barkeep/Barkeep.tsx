import * as React from "react";
import barkeepAvatar from "../../images/barkeep-avatar_resized_levels_nowarm_optimized.webp";
import { allArchetypesById } from "../../data/archetypes";
import { useLegendaryStats, useSelectedArchetypeId } from "../../stores/legendaryStore";
import { CategoryId } from "../../types/models";
import {
    getCompletedAppraisalLine,
    getDefaultLegendaryStats,
    getIncompleteBarkeepPrompt,
    getOverallRating,
    isAppraisalComplete,
} from "../Evaluator/appraisal";

interface BarkeepProps {
    categoryId: CategoryId;
}

export const Barkeep = ({ categoryId }: BarkeepProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const selectedArchetype = selectedArchetypeId ? allArchetypesById[selectedArchetypeId] : undefined;

    let barkeepLine = "Set a named piece on the table and read me the marks. I'll tell you whether it's common work or worth a noble's purse.";
    let sceneText = "The tavernkeeper gives you a nod as he keeps a rag moving across the bar.";

    if (selectedArchetype) {
        const defaultLegendaryStats = getDefaultLegendaryStats(selectedArchetype);
        const appraisalComplete = isAppraisalComplete(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId);

        sceneText = appraisalComplete
            ? "The tavernkeeper sets the piece down flat and gives it one last measured look."
            : "The tavernkeeper leans in over the table, waiting for the rest of the item's marks.";
        barkeepLine = appraisalComplete
            ? getCompletedAppraisalLine(getOverallRating(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId))
            : getIncompleteBarkeepPrompt(categoryId, selectedArchetype, legendaryStats, defaultLegendaryStats);
    }

    return (
        <div className="barkeep">
            <img className="barkeepAvatar" src={barkeepAvatar} alt="" />
            <div className="barkeepSpeech">
                {sceneText && <div className="barkeepSceneText">{sceneText}</div>}
                <div className="barkeepCopy">{barkeepLine}</div>
            </div>
        </div>
    );
};
