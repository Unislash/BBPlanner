import "url-search-params-polyfill";
import "es6-object-assign/auto";
import * as React from "react";
import ReactDOM from "react-dom";
import { PlannerApp } from "./PlannerApp";
import { initializePlannerHistory, startPlannerHistoryTracking, syncPlannerHistoryToCurrentState } from "./stores/historyStore";
import { loadFromURL } from "../url";

window.onpopstate = () => {
    loadFromURL();
    syncPlannerHistoryToCurrentState();
};

const rootElement = document.getElementById("root");
ReactDOM.render(<PlannerApp />, rootElement, () => {
    loadFromURL();
    initializePlannerHistory();
    startPlannerHistoryTracking();
});
