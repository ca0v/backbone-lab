import _ from "underscore";
import Backbone from "backbone";
import Marionette from "backbone.marionette";

class ParentView extends Marionette.View<Backbone.Model> {
	constructor(options = {}) {
		options = _.defaults(options, {
			tagName: "h1",
			template: _.template(`<label>Hello <placeholder/>!</label>`),
			regions: {
				placeholder: {
					el: "placeholder",
					replaceElement: true
				}
			}
		});
		super(options);
	}
}

class ChildView extends Marionette.View<Backbone.Model> {
	constructor(options = {}) {
		options = _.defaults(options, {
			tagName: "b",
			template: _.template(`World`)
		});
		super(options);
	}
}

export function run() {
	let parentElement = document.createElement("div");
	document.body.appendChild(parentElement);

	let parentView = new ParentView({
		el: parentElement
	});

	let childView = new ChildView();
	parentView.getRegion("placeholder").show(childView);
}
