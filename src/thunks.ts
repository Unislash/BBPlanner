import {removeBuildFromStorage, updateStorageForCurrentBuild} from './storage';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {AppState} from './models';
import {setBuildIdList} from './actions';
import {getAvailableNumberOfPerks, maxLevel} from './logic';

type GetState = () => AppState;
type TDispatch = ThunkDispatch<AppState, {}, AnyAction>

export const saveBuild = () => {
    return (dispatch: TDispatch, getState: GetState) => {
        updateStorageForCurrentBuild(getState(), true);
        dispatch(setBuildIdList(localStorage.getObject("bbplanner") || []))
    };
};

export const removeBuild = (buildId: string) => {
    return (dispatch: TDispatch) => {
        const newBuildIdList = removeBuildFromStorage(buildId);
        dispatch(setBuildIdList(newBuildIdList));
    };
};
