import _ = require("underscore");
import {ControlView} from "../views/controls-view";

class View extends ControlView {
    template = _.template("<div><label>REPLACES ORIGINAL VIEW BODY for <%= id %></label></div>")
}

function createView(model: Backbone.Model) {
    let d = $.Deferred<Marionette.View<any>>();
    let view = new View({
        model: model,
    });
    d.resolve(view);
    return d;
}

export = {
    createView: createView
};