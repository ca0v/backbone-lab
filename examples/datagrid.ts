import Backbone from "backbone";
import * as Backgrid from "backgrid";

class MyModel extends Backbone.Model {
	public name: string | undefined;
}

class MyCollection extends Backbone.Collection<MyModel> {
	model = MyModel;
	url = "../examples/extras/data/backgrid.json";
}

export function loadCss(options: { name: string; url?: string; css?: string }) {
	if (!options.url && !options.css) throw "must provide either a url or css option";
	if (options.url && options.css) throw "cannot provide both a url and a css";
	if (!options.url) throw "css not supported, provide a url option";

	let id = `style-${options.name}`;
	let head = document.getElementsByTagName("head")[0];
	let link = <HTMLLinkElement>document.getElementById(id);
	if (!link) {
		link = document.createElement("link");
		link.id = id;
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = options.url;
		head.appendChild(link);
	}
	let dataset = link.dataset;
	dataset["count"] = parseInt(dataset["count"] || "0") + 1 + "";
	return () => {
		dataset["count"] = parseInt(dataset["count"] || "0") - 1 + "";
		if (dataset["count"] === "0") {
			link.remove();
		}
	};
}

export function run() {
	loadCss({ name: "backgrid", url: requirejs.toUrl("backgrid") + "/../backgrid.css" });
	let parentElement = document.createElement("div");
	document.body.appendChild(parentElement);

	let collection = new MyCollection();
	collection.fetch().then(() => {
		let fields = ["name", "email"];
		let columns = fields.map(name => ({
			name: name,
			label: name,
			cell: "string" // this need not be a Backgrid.StringCell
		}));

		let grid = new Backgrid.Grid({
			columns: <any>columns, // this should not be a model
			collection: collection
		});

		console.log(collection.models[0].attributes);
		parentElement.appendChild(grid.render().el);
	});
}
