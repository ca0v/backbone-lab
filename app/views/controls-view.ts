import _ = require("underscore");
import Marionette from "backbone.marionette";
import Backbone from "backbone";
import { CommandsView } from "./commands-view";
import { ControlModel, ControlCollection } from "../models/control-model";
import { Controller } from "../contracts/controller";

/**
 * Renders a nested control collection using a TreeView
 */
export class ControlView extends Marionette.View<ControlModel> {
    template = _.template(`
    <div class="control-view <%= id %>">
        <div class="placeholder"></div>
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

        let commands = this.model.commands;
        if (commands) {
            this.showChildView("commands", new CommandsView({
                collection: commands,
            }));
        }

        let controls = this.model.controls;
        if (controls) {
            this.showChildView("children", new ControlsView({
                collection: controls,
                controller: this.getOption("controller"),
            }));
        }

    }

    getOption(id: string) {
        let option = super.getOption(id);
        if (typeof option === "undefined") {
            return this.model.getOption(id);
        }
        return option;
    }
}

export class ControlsView extends Marionette.CollectionView<ControlModel, ControlView, ControlCollection> {
    childView = ControlView;

    constructor(options: {
        collection: ControlCollection;
        controller: any;
    }) {
        super(options);
    }

    buildChildView(child: ControlModel, childViewClass: { new(...args: any[]): ControlView }, childViewOptions: Marionette.ViewOptions<ControlModel>) {
        // the child "mid" can be instantiated and rendered inside this placeholder-view
        let childView = new childViewClass(_.extend({
            controller: this.getOption("controller"),
            model: child
        }, childViewOptions));

        let mid = child.mid;
        if (mid) {
            requirejs([mid], (controller: Controller) => {
                controller.createView({
                    model: child,
                    controller: this.getOption("controller"),
                }).then(view => {
                    let el = childView.$(".placeholder")[0];
                    view.setElement(el);
                    view.render();
                });
            });
        }

        return childView;
    }
}
