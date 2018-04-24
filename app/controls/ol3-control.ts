import ol from "openlayers";
import _ = require("underscore");
import { ControlView } from "../views/controls-view";
import { Controller } from "./base-control";

class View extends ControlView {
    template = _.template(`<div class="ol-control" style="position:inherit"></div>`);

    onRender() {
        let map = this.getOption("controller").model.get("map") as ol.Map;
        let controlType = this.getOption("control-type");
        let ControlConstructor = (<any>ol.control)[controlType];
        if (ControlConstructor) {
            let control = new ControlConstructor({
                target: this.$el[0],
            });
            map.addControl(control);
        }
    }
}

let controller = new Controller({ view: View });

export = controller;