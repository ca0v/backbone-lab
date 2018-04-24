import _ = require("underscore");
import { ControlView } from "../views/controls-view";
import { Controller } from "./base-control";

class View extends ControlView {
    template = _.template(`<div class="grid"><label>GRID</label></div>`)
}

let controller = new Controller({ view: View });

export = controller;