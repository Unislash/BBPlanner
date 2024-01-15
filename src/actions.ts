import {AnyAction} from 'redux';

export const CREATE_NEW_BUILD = "CREATE_NEW_BUILD";
export const SET_BUILD_NAME = "SET_BUILD_NAME";
export const SET_BUILD_ID_LIST = "SET_BUILD_ID_LIST";

export const createNewBuild = (): AnyAction => ({
    type: CREATE_NEW_BUILD,
    payload: {},
});

export const setBuildName = (buildName: string, withSave?: boolean): AnyAction => ({
    type: SET_BUILD_NAME,
    payload: {buildName, withSave},
});

export const setBuildIdList = (buildIdList: string[]): AnyAction => ({
    type: SET_BUILD_ID_LIST,
    payload: {buildIdList},
});
