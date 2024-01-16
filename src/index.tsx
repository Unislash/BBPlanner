import ReactDOM from 'react-dom';
import * as React from 'react';

import 'url-search-params-polyfill';
import 'es6-object-assign/auto';

import {App} from './App';
import {loadFromURL} from './url';

window.onpopstate = () => {
    loadFromURL();
};

const rootElement = document.getElementById('root');
ReactDOM.render(
    <App/>,
    rootElement,
    () => {
        loadFromURL();
    }
);
