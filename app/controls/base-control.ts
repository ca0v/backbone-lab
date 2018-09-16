import _ = require("underscore");
import Backbone from "backbone";
import { Controller as IController } from "../contracts/controller";
import { ControlModel } from "../models/control-model";

interface ViewConstructor {
	new (args: { model: ControlModel }): Backbone.View<ControlModel>;
}

export class Controller implements IController {
	constructor(public options: { view: ViewConstructor }) {}

	createView(options: { model: ControlModel }) {
		let d = $.Deferred<Backbone.View<ControlModel>>();

		let viewMid = options.model.getOption("view");
		if (viewMid) {
			requirejs([viewMid], (View: ViewConstructor) => {
				let view = new View(options);
				d.resolve(view);
			});
		} else {
			console.log("no view module defined");
			let view = new this.options.view(options);
			d.resolve(view);
		}

		return d;
	}
}
