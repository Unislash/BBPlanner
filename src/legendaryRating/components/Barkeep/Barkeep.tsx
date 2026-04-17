import * as React from "react";
import { useEffect, useState } from "react";
import barkeepAvatar from "../../images/barkeep-avatar_resized_levels_nowarm_optimized.webp";
import { allArchetypesById } from "../../data/archetypes";
import { useLegendaryStats, useSelectedArchetypeId } from "../../stores/legendaryStore";
import type { CategoryId } from "../../types/models";
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
                sceneText: "The barkeep squints at the one-handers as he cleans his mug.",
                barkeepLine:
                    "One-handed kit tells on a soul quick. Handy, mean, close to the ribs. Alright, set one here and I'll tell yeh if it's fit for yeh.",
            };
        case "twoHanded":
            return {
                sceneText: "The barkeeper looks at the long blades with knowing eyes.",
                barkeepLine:
                    "Two-handed work's honest, eh? Too big to lie. Show me yer metal and I'll tell yeh if it's a killer, or an antique burning a hole in yer pocket.",
            };
        case "ranged":
            return {
                sceneText: "The barkeep gives the ranged pieces a measured look.",
                barkeepLine:
                    "Ranged gear tells on its maker quick. Good work shows itself before the shot ever leaves the hand. Bad work shows itself in the eye.",
            };
        case "shield":
            return {
                sceneText: "The barkeep studies the shields a moment before touching on them.",
                barkeepLine:
                    "A shield earns its name by what it survives. Some o' these look stout. Some look like they'd lose an argument with a chair leg.",
            };
        case "helmet":
            return {
                sceneText: "The barkeeper eyes the helms with an old soldier's look.",
                barkeepLine:
                    "A good helm ought to sit solid and spare the neck besides. A bad one just keeps the skull tidy for burial. Go on, show me what yeh brought.",
            };
        case "armor":
            return {
                sceneText: "Lamellar, mail, and plate catch the candlelight as the barkeeper studies them.",
                barkeepLine:
                    "Armor's always a bargain between burden and staying alive. Best smiths cheat that bargain a little. Worst ones sell yeh a coffin with straps.",
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
        const appraisalComplete = isAppraisalComplete(
            selectedArchetype,
            legendaryStats,
            defaultLegendaryStats,
            categoryId,
        );

        nextSceneText = appraisalComplete
            ? "The barkeep sets the piece down and gives it a final reckoning before looking back at you."
            : "The barkeep leans over the piece, waiting for the rest of it.";
        nextBarkeepLine = appraisalComplete
            ? getCompletedAppraisalLine(
                  getOverallRating(selectedArchetype, legendaryStats, defaultLegendaryStats, categoryId),
              )
            : getIncompleteBarkeepPrompt(categoryId, selectedArchetype, legendaryStats, defaultLegendaryStats);
    }

    const [displayedSpeech, setDisplayedSpeech] = useState({
        barkeepLine: nextBarkeepLine,
        sceneText: nextSceneText,
    });
    const [isSpeechVisible, setIsSpeechVisible] = useState(true);

    useEffect(() => {
        if (displayedSpeech.barkeepLine === nextBarkeepLine && displayedSpeech.sceneText === nextSceneText) {
            if (!isSpeechVisible) {
                setIsSpeechVisible(true);
            }
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
    }, [displayedSpeech.barkeepLine, displayedSpeech.sceneText, isSpeechVisible, nextBarkeepLine, nextSceneText]);

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
