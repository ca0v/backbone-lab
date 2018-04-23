import _ = require("underscore");
import Backbone from "backbone";
import Marionette from "backbone.marionette";

export class CommandsView extends Marionette.CollectionView<any, CommandView> {
    childView = CommandView;
}

export class CommandView extends Marionette.View<any> {
    template = _.template(`<input type="button" class="command" value="<%= id %>" />`);
}
