import * as React from 'react';
import ReactDOM from 'react-dom';
import {App} from './App';
import {loadFromURL} from './url';
import 'url-search-params-polyfill';
import 'es6-object-assign/auto';

window.onpopstate = () => {
    loadFromURL();
};

const rootElement = document.getElementById('root');
ReactDOM.render(
    <App />,
    rootElement,
    () => {
        loadFromURL();
    }
);
