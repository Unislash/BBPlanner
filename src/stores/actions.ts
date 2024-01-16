import {resetURL} from '../url';
import {initialPerkStore, perkStore} from './perkStore';
import {buildStore, initialBuildStore} from './buildStore';
import {initialStatsStore, statsStore} from './statsStore';
import {initialStarsStore, starsStore} from './starsStore';
import {initialLoadoutStore, loadoutStore} from './loadoutStore';

export const createNewBuild = () => {
    const {setBuildName} = buildStore.getState().actions;
    const {setPerks, setStudent} = perkStore.getState().actions;
    const {setStatNums} = statsStore.getState().actions;
    const {setStars} = starsStore.getState().actions;
    const {setLoadoutItems} = loadoutStore.getState().actions;

    setPerks(initialPerkStore.activePerkIds);
    setStudent(initialPerkStore.isStudent);
    setBuildName(initialBuildStore.buildName);
    setStatNums(initialStatsStore.statNums);
    setStars(initialStarsStore.stars);
    setLoadoutItems(initialLoadoutStore.loadoutItems);

    resetURL(true);
}
