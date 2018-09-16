import Marionette from "backbone.marionette";
import { CommandModel } from "../models/command-model";

export class CommandsView extends Marionette.CollectionView<CommandModel, CommandView> {
	childView = CommandView;
}

export class CommandView extends Marionette.View<CommandModel> {
	template = () =>
		`<input type="button" class="command ${this.model.get("id")}" value="${this.model.get(
			"text"
		)}" title="${this.model.get("id")}"/>`;

	events() {
		return {
			"click .command": "click"
		};
	}

	initialize() {
		this.listenTo(this.model, "change", () => this.render());
	}

	render() {
		// how to associte the command button with a handler
		return super.render();
	}

	click() {
		let event = this.model.getOption("event") || this.model.get("id");
		this.trigger("execute", { event });
	}
}
