import * as React from "react";
import { useEffect, useState } from "react";
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

const getCategorySelectionScene = (categoryId: CategoryId) => {
    switch (categoryId) {
        case "oneHanded":
            return {
                sceneText: "The tavernkeeper glances over the shorter weapons spread across the scarred boards.",
                barkeepLine: "There's good close work among these one-handed pieces. A man could judge a brother by what he keeps at his hip.",
            };
        case "twoHanded":
            return {
                sceneText: "The longer hafts and broad blades draw a few looks from the darker corners of the room.",
                barkeepLine: "Two-handed work always has a bit of pride in it. Hard to hide a poor make when there's this much steel on the table.",
            };
        case "ranged":
            return {
                sceneText: "The tavernkeeper's eyes linger on the ranged pieces a moment longer, measuring them by string, stock, and balance.",
                barkeepLine: "Ranged gear tells on its maker quickly. Fine work shows itself before the shot ever leaves the hand.",
            };
        case "shield":
            return {
                sceneText: "He gives the shields an appraising look, as if listening for the weight of each board before touching it.",
                barkeepLine: "A shield earns its name by what it endures. Some look stout enough already; some only look painted well.",
            };
        case "helmet":
            return {
                sceneText: "The tavernkeeper eyes the helms the way an old hand looks at dents in a veteran's breastplate.",
                barkeepLine: "A good helm ought to sit solid and spare the neck besides. That's the kind of craft worth talking about.",
            };
        case "armor":
            return {
                sceneText: "Lamellar, mail, and plate catch the candlelight as the tavernkeeper studies the lot.",
                barkeepLine: "Armor's always a bargain between burden and protection. The best smiths know how to cheat that bargain a little.",
            };
    }
};

export const Barkeep = ({ categoryId }: BarkeepProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const selectedArchetype = selectedArchetypeId ? allArchetypesById[selectedArchetypeId] : undefined;

    const categorySelectionScene = getCategorySelectionScene(categoryId);
    let nextBarkeepLine = categorySelectionScene.barkeepLine;
    let nextSceneText = categorySelectionScene.sceneText;

    if (selectedArchetype) {
        const defaultLegendaryStats = getDefaultLegendaryStats(selectedArchetype);
        const appraisalComplete = isAppraisalComplete(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId);

        nextSceneText = appraisalComplete
            ? "The tavernkeeper sets the piece down flat and gives it one last measured look."
            : "The tavernkeeper leans in over the table, waiting for the rest of the item's marks.";
        nextBarkeepLine = appraisalComplete
            ? getCompletedAppraisalLine(getOverallRating(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId))
            : getIncompleteBarkeepPrompt(categoryId, selectedArchetype, legendaryStats, defaultLegendaryStats);
    }

    const [displayedSpeech, setDisplayedSpeech] = useState({
        barkeepLine: nextBarkeepLine,
        sceneText: nextSceneText,
    });
    const [isSpeechVisible, setIsSpeechVisible] = useState(true);

    useEffect(() => {
        if (
            displayedSpeech.barkeepLine === nextBarkeepLine &&
            displayedSpeech.sceneText === nextSceneText
        ) {
            return;
        }

        setIsSpeechVisible(false);

        const timeoutId = setTimeout(() => {
            setDisplayedSpeech({
                barkeepLine: nextBarkeepLine,
                sceneText: nextSceneText,
            });
            setIsSpeechVisible(true);
        }, 200);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [displayedSpeech.barkeepLine, displayedSpeech.sceneText, nextBarkeepLine, nextSceneText]);

    return (
        <div className="barkeep">
            <img className="barkeepAvatar" src={barkeepAvatar} alt="" />
            <div className={`barkeepSpeech ${isSpeechVisible ? "isVisible" : "isHidden"}`}>
                {displayedSpeech.sceneText && <div className="barkeepSceneText">{displayedSpeech.sceneText}</div>}
                <div className="barkeepCopy">{displayedSpeech.barkeepLine}</div>
            </div>
        </div>
    );
};
