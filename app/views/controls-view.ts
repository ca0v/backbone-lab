import Marionette from "backbone.marionette";
import Backbone from "backbone";

interface ControlModel extends Backbone.Model {
    id: string;
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
    template = _.template(`<div class="control-view"><div class="control-view-body"><%= id %></div><div class="children"></div></div>`);

    constructor(options = {}) {
        super(options);
        this.addRegions({
            "children": {
                el: ".children",
                replaceElement: true,
            }
        });
    }

    onRender() {
        let controls = this.model.get("Controls");
        if (controls) {
            return this.showChildView("children", new ControlsView({
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

    buildChildView(model: ControlModel, ChildViewClass = ControlView, childViewOption: any) {

        let view = new ChildViewClass({
            model: model
        });

        return view;
    }

} 