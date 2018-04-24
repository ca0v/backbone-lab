import _ = require("underscore");
import { ControlView } from "../views/controls-view";

class View extends ControlView {
    template = _.template(`<div class="grid"><label>GRID</label></div>`)
}

function createView(options: { model: Backbone.Model }) {
    let d = $.Deferred<Marionette.View<any>>();
    let view = new View(options);
    d.resolve(view);
    return d;
}

export = {
    createView: createView
};