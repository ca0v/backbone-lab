import Backbone, { Model } from "backbone";
import expect from "ceylon/index";

describe("backbone", () => {
	it("create a backbone model", () => {
		let model = new Backbone.Model({ name: "backbone" });
		let d = Backbone.$.Deferred();
		model.once("change", () => {
			expect(model.get("name")).toEqual("backbone-test");
			model.destroy();
			d.resolve();
		});
		model.set("name", "backbone-test");
		return d;
	});

	it("create a backbone collection", done => {
		let collection = new Backbone.Collection();
		let models = [1, 2].map(n => new Model({ name: "backbone", id: n }));

		collection.once("update", () => {
			expect(collection.isEmpty()).toBeFalse("has two models");
			collection.once("update", () => {
				expect(collection.isEmpty()).toBeTrue("collection is empty");
				done();
			});
			collection.remove(models);
		});
		collection.add(models);
	}).timeout(10);
});
