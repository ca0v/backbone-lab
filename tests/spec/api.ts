import Backbone from "backbone";
import Marionette from "backbone.marionette";
import Radio from "backbone.radio";
import * as Backgrid from "backgrid";
import {expect} from "ceylon/index";

describe("backbone", () => {
	it("ensures modules exist", () => {
		expect(Backbone).toExist();
		expect(Marionette).toExist();
		expect(Radio).toExist();
		expect(Backgrid).toExist();
	});

	it("ensures backbone API", () => {
		[
			Backbone.$,
			Backbone.ajax,
			Backbone.Collection,
			Backbone.Events,
			Backbone.Model,
			Backbone.Radio,
			Backbone.Router,
			Backbone.View
		].forEach((n, i) => expect(n).toExist(i + ""));
	});

	it("ensures marionette API", () => {
		[
			Marionette.Application,
			Marionette.AppRouter,
			Marionette.Behavior,
			Marionette.Behaviors,
			Marionette.CollectionView,
			//Marionette.Container,
			Marionette.Object,
			Marionette.Region,
			Marionette.Renderer
		].forEach((n, i) => expect(n).toExist(i + ""));
	});

	it("ensures radio API", () => {
		[
			Radio.Channel,
			//Radio.Commands,
			Radio.Requests,
			Radio.VERSION
		].forEach((n, i) => expect(n).toExist(i + ""));
	});

	it("ensures backgrid API", () => {
		[
			Backgrid.Body,
			Backgrid.Cell,
			Backgrid.CellEditor,
			Backgrid.CellFormatter,
			Backgrid.Column,
			//Backgrid.Command,
			//Backgrid.DateTimeFormatter,
			Backgrid.EmailFormatter,
			Backgrid.Footer,
			Backgrid.Grid,
			Backgrid.Header,
			Backgrid.InputCellEditor,
			Backgrid.NumberFormatter,
			Backgrid.PercentFormatter,
			Backgrid.Row,
			Backgrid.SelectFormatter
		].forEach((n, i) => expect(n).toExist(i + ""));
	});
});
