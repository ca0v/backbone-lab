import ol from "openlayers";
import Backbone from "backbone";
import Marionette from "backbone.marionette";
import { MapView } from "../views/map-view";
import { ControlView } from "../views/controls-view";
import { ControlCollection, ControlModel } from "../models/control-model";
import maplet from "./data/configuration";
import { CommandCollection, CommandModel } from "../models/command-model";

type CommandType = {
    id: string;
    Options: { Value: Array<{ id: string; value: string }> }
}

type ControlType = {
    id: string;
    mid: string;
    Controls: { Controls: Array<ControlType>; };
    Commands: { Commands: Array<CommandType> };
    Options: { Value: Array<{ id: string; value: string }> }
};

class MapletConverter {
    asModel() {
        let mapletControls = maplet.Controls.Controls.map(c => this.asControlModel(<any>c));
        return {
            controls: new ControlCollection(mapletControls)
        };
    }

    asCommandModel(command: CommandType) {
        return new CommandModel(command);
    }

    asControlModel(control: ControlType) {
        let commandCollection = new CommandCollection();
        let controlCollection = new ControlCollection();
        let result = new ControlModel({
            id: control.id,
            mid: control.mid,
            Controls: controlCollection,
            Commands: commandCollection,
            Options: control.Options,
        });

        if (control.Commands) {
            control.Commands.Commands.forEach(c => {
                let childModel = this.asCommandModel(c);
                commandCollection.add(childModel);
            });
        }
        if (control.Controls) {
            control.Controls.Controls.forEach(c => {
                let childModel = this.asControlModel(c);
                controlCollection.add(childModel);
            });
        }
        return result;
    }

}
function asModel(control: ControlModel) {
    let controls = control.controls;
    if (controls) {
        control.set("Controls", {
            Controls: controls.map(c => asModel(c))
        });
    }
}

function run() {

    let mapDom = document.createElement("div");
    mapDom.className = "fullscreen map";
    document.body.appendChild(mapDom);

    let mapView = new MapView({
        el: mapDom,
        model: new Backbone.Model({
            zoom: 5,
            center: [-85, 35]
        }),
    });

    mapView.render();

    let converter = new MapletConverter();
    let rootControls = converter.asModel().controls;

    // how will the views find the map?  Assign the mapView as the controller.
    let controlViews = rootControls.map(model => {
        let view = new ControlView({
            model: model,
            controller: mapView
        });
        return view;
    });

    controlViews.forEach(controlView => {
        mapView.addControl(controlView);
    });

}

export = run;