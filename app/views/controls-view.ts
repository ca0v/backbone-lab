import _ = require("underscore");
import Marionette from "backbone.marionette";
import Backbone from "backbone";
import { CommandsView } from "./commands-view";

interface ControlModel extends Backbone.Model {
    id: string;
    get(id: "Commands"): {
        Commands: ControlModel[],
    };
    get(id: "Controls"): {
        Controls: ControlModel[],
    };
    get(id: "Options"): {
        Values: Array<{ id: string; value: string }>;
    }
}

/**
 * Renders a nested control collection using a TreeView
 */
export class ControlView extends Marionette.View<ControlModel> {
    template = _.template(`
    <div class="control-view">
        <div class="placeholder"><%= id %></div>
        <div class="control-commands"></div>
        <div class="children"></div>
    </div>`);

    constructor(options = {}) {
        super(options);
        this.addRegions({
            "placeholder": {
                el: ".placeholder",
                replaceElement: true,
            },
            "commands": {
                el: ".control-commands",
                replaceElement: false,
            },
            "children": {
                el: ".children",
                replaceElement: true,
            }
        });
    }

    onRender() {

        let commands = this.model.get("Commands");
        if (commands) {
            this.showChildView("commands", new CommandsView({
                collection: new Backbone.Collection(commands.Commands.map(c => new Backbone.Model(c))),
            }));
        }

        let controls = this.model.get("Controls");
        if (controls) {
            this.showChildView("children", new ControlsView({
                collection: new Backbone.Collection(controls.Controls.map(c => new Backbone.Model(c))),
            }));
        }

    }

    getOption(id: string) {
        let option = super.getOption(id);
        if (typeof option === "undefined") {
            let options = this.model.get("Options").Values.filter(o => o.id === id);
            option = options[0] && options[0].value;
        }
        return option;
    }
}

export class ControlsView extends Marionette.CollectionView<ControlModel, ControlView> {
    childView = ControlView;

    buildChildView(child: ControlModel, childViewClass: { new(...args: any[]): ControlView }, childViewOptions: Marionette.ViewOptions<ControlModel>) {
        // the child "mid" can be instantiated and rendered inside this placeholder-view
        let childView = new childViewClass(_.extend({
            model: child
        }, childViewOptions));

        let mid = child.get("mid");
        if (mid) {
            requirejs([mid], (controller: Controller) => {
                //let el = document.createElement("div");
                //childView.$(".placeholder").append(el);
                let el = childView.$(".placeholder")[0];
                controller.createView(child).then(view => {
                    view.setElement(el);
                    view.render();
                });
            });
        }

        return childView;
    }
}
