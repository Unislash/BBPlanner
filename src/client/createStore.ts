import {appReducer} from './reducers';
import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

export const store = createStore(appReducer, applyMiddleware(thunk));