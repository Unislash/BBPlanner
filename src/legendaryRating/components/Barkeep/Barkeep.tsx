import * as React from "react";
import classcat from "classcat";
import { useEffect, useState } from "react";
import { allArchetypesById } from "../../data/archetypes";
import { useLegendaryStats, useSelectedArchetypeId } from "../../stores/legendaryStore";
import type { LegendaryThemeId } from "../../themes";
import type { CategoryId, SelectedCategoryId } from "../../types/models";
import {
    getCompletedAppraisalLine,
    getDefaultLegendaryStats,
    getIncompleteBarkeepPrompt,
    getOverallRating,
    isAppraisalComplete,
} from "../Evaluator/appraisal";

interface BarkeepProps {
    avatarImage?: string;
    categoryId: SelectedCategoryId;
    themeId: LegendaryThemeId;
}

const barkeepGreetings = [
    {
        sceneText: "You duck beneath the tavern lintel as you clear the doorway. The old giant of a barkeep spots you at once and snorts.",
        barkeepLine: "Thought I'd smelled road dust. Go on then. What've you dragged out o' the wilds this time?",
    },
    {
        sceneText: "The barkeep is polishing a tankard as you enter. He sets it aside when he sees you.",
        barkeepLine: "Captain. Been busy, have yeh? Let's see if any o' that loot's worth braggin' about.",
    },
    {
        sceneText: "The barkeep is wrestling a squealing piglet toward the kitchen when you arrive.",
        barkeepLine: "Damn thing's got more fight than half the sellswords I've known. Hold on. Now--what've yeh brought this time?",
    },
    {
        sceneText: "The tavern is quiet at this time of night as you slip through the door. The barkeep watches you approach and grins through his beard.",
        barkeepLine: "Either yeh found treasure, or yeh need a drink. I don't recall yeh being the drinking sort, so what have you wrestled up this time?",
    },
    {
        sceneText: "As you enter the tavern the barkeep waves you over before you've even reached the counter.",
        barkeepLine: "Don't stand there grinnin'. Put the piece down and let an old bastard judge it proper.",
    },
    {
        sceneText: "A burly man stands behind the bar, having a nip of ale. The barkeep wipes his beard and points at an empty patch of counter.",
        barkeepLine: "Back again with something special? Put it there then. If it's a keeper, I'll tell yeh... if it's not, I'll tell yeh louder.",
    },
    {
        sceneText: "A deep laugh rumbles from behind the bar as you step inside the tavern.",
        barkeepLine: "Either yeh found something rare, or yeh found some trouble. Or both. Show it here then and we'll see if it was worth it.",
    },
    {
        sceneText: "You enter the crowded tavern and the old barkeep quickly picks you out of the rabble.",
        barkeepLine: "Oh aye, the captain's back, is he? What treasure have your travels brought yeh this time? Let's have a look."
    },
];

const getCategorySelectionScene = (categoryId: CategoryId) => {
    switch (categoryId) {
        case "oneHanded":
            return {
                // sceneText: "The barkeep squints at the one-handers as he cleans his mug.",
                barkeepLine:
                    "One-handed kit tells on a soul quick. Handy, mean, close to the ribs. Set it here and I'll tell yeh if it's worth carrying.",
            };
        case "twoHanded":
            return {
                // sceneText: "The barkeeper looks at the long blades with knowing eyes.",
                barkeepLine:
                    "Two-handed work is honest, eh? Too big to lie. Set it here and I'll tell yeh if it's a killer or just old iron.",
            };
        case "ranged":
            return {
                // sceneText: "The barkeep gives the ranged pieces a measured look.",
                barkeepLine:
                    "Ranged gear tells on its maker quick. Good work shows itself before the shot ever leaves the hand. Let's see what yeh got.",
            };
        case "shield":
            return {
                // sceneText: "The barkeep studies the shields a moment before touching on them.",
                barkeepLine:
                    "A shield earns its name by what it survives. Some look stout. Some look like they'd lose an argument with a chair leg.",
            };
        case "helmet":
            return {
                // sceneText: "The barkeeper eyes the helms with an old soldier's look.",
                barkeepLine:
                    "A good helm ought to sit solid. A bad one just keeps the skull tidy for burial. Alright then, show me what yeh brought today.",
            };
        case "armor":
            return {
                // sceneText: "Lamellar, mail, and plate catch the candlelight as the barkeeper studies them.",
                barkeepLine:
                    "Armor's always a bargain between burden and staying alive. The best smiths cheat the scales. The worst sell yeh a coffin with straps.",
            };
    }
};

export const Barkeep = ({ avatarImage, categoryId, themeId }: BarkeepProps): JSX.Element => {
    const selectedArchetypeId = useSelectedArchetypeId();
    const legendaryStats = useLegendaryStats();
    const selectedArchetype = selectedArchetypeId ? allArchetypesById[selectedArchetypeId] : undefined;
    const [landingGreeting] = useState(() => barkeepGreetings[Math.floor(Math.random() * barkeepGreetings.length)]);

    const categorySelectionScene = categoryId ? getCategorySelectionScene(categoryId) : landingGreeting;
    let nextBarkeepLine = categorySelectionScene.barkeepLine;
    let nextSceneText = categorySelectionScene.sceneText;

    if (selectedArchetype && categoryId) {
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
            <div className={classcat(["barkeepAvatarFrame", `barkeepAvatarFrame_${themeId}`, { hasImage: !!avatarImage }])}>
                {avatarImage ? <img className="barkeepAvatar" src={avatarImage} alt="" /> : <div className="barkeepAvatarGradient" />}
            </div>
            <div className={`barkeepSpeech ${isSpeechVisible ? "isVisible" : "isHidden"}`}>
                {displayedSpeech.sceneText && <div className="barkeepSceneText">{displayedSpeech.sceneText}</div>}
                <div className="barkeepCopy">{displayedSpeech.barkeepLine}</div>
            </div>
        </div>
    );
};
