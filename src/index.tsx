import ReactDOM from 'react-dom';
import * as React from 'react';
import {Provider} from 'react-redux';

import 'url-search-params-polyfill';

import {App} from './App';
import {store} from './createStore';
import {loadFromURL} from './url';

window.onpopstate = () => {
    loadFromURL();
};

const rootElement = document.getElementById('root');
ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    rootElement,
    () => {
        loadFromURL();
    }
);
