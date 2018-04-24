import Backbone from "backbone";

export interface ICommandModel {
    id: string;
    Options: { Values: Array<{ id: string; value: string }> };
}

export class CommandModel extends Backbone.Model implements ICommandModel {

    get id() {
        return this.get("id");
    }

    get Options() {
        return this.get("Options");
    }

}

export class CommandCollection extends Backbone.Collection<CommandModel> {
    model = CommandModel;
}