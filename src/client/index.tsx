import ReactDOM from 'react-dom';
import * as React from 'react';
import {App} from './App';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {appReducer} from './reducers';

const store = createStore(appReducer);

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    rootElement,
);
