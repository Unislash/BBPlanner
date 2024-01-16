import {resetURL} from '../url';
import {initialPerkStore, usePerkActions} from './perkStore';
import {initialBuildStore, useBuildActions} from './buildStore';
import {initialStatsStore, useStatsActions} from './statsStore';
import {initialStarsStore, useStarsActions} from './starsStore';
import {initialLoadoutStore, useLoadoutActions} from './loadoutStore';

export const createNewBuild = () => {
    const {setPerks, setStudent} = usePerkActions();
    const {setBuildName} = useBuildActions();
    const {setStatNums} = useStatsActions();
    const {setStars} = useStarsActions();
    const {setLoadoutItems} = useLoadoutActions();

    setPerks(initialPerkStore.activePerkIds);
    setStudent(initialPerkStore.isStudent);
    setBuildName(initialBuildStore.buildName);
    setStatNums(initialStatsStore.statNums);
    setStars(initialStarsStore.stars);
    setLoadoutItems(initialLoadoutStore.loadoutItems);

    resetURL(true);
}
