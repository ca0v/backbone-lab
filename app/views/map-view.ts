import ol from "openlayers";
import Marionette from "backbone.marionette";

export class MapView extends Marionette.View<any> {
	template = `<div class="map"><div class="map-controls"></div></div>`;

	private map: ol.Map | null;

	constructor(options: any) {
		super(options);
		this.map = null;
		this.addRegion("controls", ".map-controls");
	}

	onRender() {
		let mapDom = this.el;

		let map = (this.map = new ol.Map({
			target: mapDom,
			view: new ol.View({
				center: this.model.get("center"),
				zoom: this.model.get("zoom"),
				minZoom: 0,
				maxZoom: 16
			}),
			layers: [
				new ol.layer.Tile({
					source: new ol.source.TileDebug({
						projection: "EPSG:4326",
						tileGrid: ol.tilegrid.createXYZ({ tileSize: 256 })
					})
				})
			]
		}));

		this.model.set("map", map);
	}

	addControl(controlView: Marionette.View<any>) {
		if (!this.map) {
			console.error("no map assigned to view");
			return;
		}
		let positionName = controlView.getOption("position") || "top-1 left-1";
		let positionCss = "." + positionName.split(" ").join(" .");
		let controlsDom = this.$(`.map-controls`);
		let controlDom = $(`map-control ${controlView.id} ${positionCss}`, controlsDom);
		if (!controlDom.length) {
			let controlDom = $(`<div class="map-control ${positionName}"></div>`)[0];
			controlsDom.append(controlDom);
			controlView.$el.appendTo(controlDom);

			let control = new ol.control.Control({
				element: controlDom,
				render: (event: ol.MapEvent) => {
					controlView.trigger("event", event);
				},
				target: undefined
			});

			this.map.addControl(control);
			controlView.render();
		} else {
			debugger;
			// control already exists, use it
		}
	}
}
