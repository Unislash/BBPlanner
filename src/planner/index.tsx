import "url-search-params-polyfill";
import "es6-object-assign/auto";
import * as React from "react";
import ReactDOM from "react-dom";
import { PlannerApp } from "./PlannerApp";
import { loadFromURL } from "../url";

window.onpopstate = () => {
    loadFromURL();
};

const rootElement = document.getElementById("root");
ReactDOM.render(<PlannerApp />, rootElement, () => {
    loadFromURL();
});
