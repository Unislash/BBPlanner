import "url-search-params-polyfill";
import "es6-object-assign/auto";
import * as React from "react";
import ReactDOM from "react-dom";
import { LegendaryApp } from "./LegendaryApp";
import { loadLegendaryFromURL } from "./url";

window.onpopstate = () => {
    loadLegendaryFromURL();
};

const rootElement = document.getElementById("root");
loadLegendaryFromURL();
ReactDOM.render(<LegendaryApp />, rootElement);
