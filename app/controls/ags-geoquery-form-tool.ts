import _ = require("underscore");
import { ControlView } from "../views/controls-view";
import { Controller } from "./base-control";

class View extends ControlView {
    template = _.template("<div><label>AGS-GEOQUERY-FORM</label></div>")
}

let controller = new Controller({ view: View });

export = controller;