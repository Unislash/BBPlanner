import {appReducer} from './reducers';
import {createStore} from 'redux';

export const store = createStore(appReducer);