import "url-search-params-polyfill";
import "es6-object-assign/auto";
import * as React from "react";
import ReactDOM from "react-dom";
import { LegendaryApp } from "./LegendaryApp";

const rootElement = document.getElementById("root");
ReactDOM.render(<LegendaryApp />, rootElement);
