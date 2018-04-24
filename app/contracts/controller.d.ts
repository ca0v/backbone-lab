import Backbone from "backbone";
import { ControlModel } from "../models/control-model";

export interface Controller {
    createView(viewOptions: {
        model: ControlModel;
        controller: any;
    }): JQuery.Deferred<Backbone.View<ControlModel>>;
}