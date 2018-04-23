import ol from "openlayers";
import Backbone from "backbone";
import Marionette from "backbone.marionette";
import { MapView } from "../views/map-view";
import { ControlView } from "../views/controls-view";

import maplet from "./data/configuration";

function run() {

    let mapDom = document.createElement("div");
    mapDom.className = "fullscreen map";
    document.body.appendChild(mapDom);

    let mapView = new MapView({
        el: mapDom,
    });

    mapView.render();

    let rootControls = maplet.Controls.Controls.map(c => new Backbone.Model(c));
    let controlViews = rootControls.map(model => new ControlView({ model: model }));
    controlViews.forEach(controlView => {
        mapView.addControl(controlView);
    });

}

export = run;