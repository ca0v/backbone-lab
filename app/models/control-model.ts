import Backbone from "backbone";
import { CommandModel, CommandCollection } from "./command-model";
import { Commands } from "backbone.radio/index";

type Values = Array<{ id: string; value: string }>;

export interface IControlModel {
    id: string;
    mid: string;
    commands: CommandCollection | null
    controls: ControlCollection | null
    options: Values;
}

export class ControlModel extends Backbone.Model implements IControlModel {

    get id() {
        return this.get("id");
    }

    get mid() {
        return this.get("mid");
    }

    get commands() {
        return this.get("Commands") as CommandCollection;
    }

    get controls() {
        return this.get("Controls") as ControlCollection;
    }

    get options() {
        let v = this.get("Options");
        return (v && v.Values) as Values;
    }

    getOption(id: string) {
        let options = this.options;
        if (options) {
            let value = options.find(n => n.id === id);
            return (value && value.value);
        }
        return undefined;
    }
}

export class ControlCollection extends Backbone.Collection<ControlModel> {
    model = ControlModel;
}

