import {updateStorage} from './storage';
import {AnyAction} from 'redux';
import {ThunkDispatch} from 'redux-thunk';
import {AppState} from './models';
import {setBuildIdList} from './actions';

type GetState = () => AppState;
type TDispatch = ThunkDispatch<AppState, {}, AnyAction>

export const saveBuild = () => {
    return (dispatch: TDispatch, getState: GetState) => {
        updateStorage(getState(), true);
        dispatch(setBuildIdList(localStorage.getObject("bbplanner") || []))
    };
};