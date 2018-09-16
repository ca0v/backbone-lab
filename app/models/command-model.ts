import Backbone from "backbone";

type Values = Array<{ id: string; value: string }>;

export interface ICommandModel {
	id: string;
	options: Array<{ id: string; value: string }>;
}

export class CommandModel extends Backbone.Model implements ICommandModel {
	get id() {
		return this.get("id");
	}

	get options() {
		let v = this.get("Options");
		return (v && v.Values) as Values;
	}

	getOption(id: string) {
		let options = this.options;
		if (options) {
			let value = options.find(n => n.id === id);
			return value && value.value;
		}
		return undefined;
	}
}

export class CommandCollection extends Backbone.Collection<CommandModel> {
	model = CommandModel;
}
