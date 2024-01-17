import { resetURL } from "../url";
import { buildStore, initialBuildStore } from "./buildStore";
import { initialLoadoutStore, loadoutStore } from "./loadoutStore";
import { initialPerkStore, perkStore } from "./perkStore";
import { initialStarsStore, starsStore } from "./starsStore";
import { initialStatsStore, statsStore } from "./statsStore";

export const createNewBuild = () => {
    const { setBuildName } = buildStore.getState().actions;
    const { setPerks, setStudent } = perkStore.getState().actions;
    const { setStatNums } = statsStore.getState().actions;
    const { setStars } = starsStore.getState().actions;
    const { setLoadoutItems } = loadoutStore.getState().actions;

    setPerks(initialPerkStore.activePerkIds);
    setStudent(initialPerkStore.isStudent);
    setBuildName(initialBuildStore.buildName);
    setStatNums(initialStatsStore.statNums);
    setStars(initialStarsStore.stars);
    setLoadoutItems(initialLoadoutStore.loadoutItems);

    resetURL(true);
};
