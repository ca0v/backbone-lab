import _ = require("underscore");
import Marionette from "backbone.marionette";
import { CommandModel } from "../models/command-model";

export class CommandsView extends Marionette.CollectionView<CommandModel, CommandView> {
    childView = CommandView;
}

export class CommandView extends Marionette.View<CommandModel> {
    template = _.template(`<input type="button" class="command <%= id %>" value="<%= id %>" />`);
}
