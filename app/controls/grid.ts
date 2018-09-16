import _ from "underscore";
import { ControlView } from "../views/controls-view";
import { Controller } from "./base-control";

class View extends ControlView {
	template = _.template(`<div class="grid"><label>GRID</label></div>`);

	constructor(options?: any) {
		super(options);
		let events = this.model.commands.map(c => c.getOption("event") || (c.get("id") as string));
		events.forEach(event => this.channel.on(event, () => alert(event)));

		let gridModel = this.model.getOption("model");
		if (gridModel) {
			requirejs([gridModel], (model: Backbone.Model) => {
				// now to bind this model to a grid/table and how to support pagination?
			});
		}
	}
}

let controller = new Controller({ view: View });

export = controller;
