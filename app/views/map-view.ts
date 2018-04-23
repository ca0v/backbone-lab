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

        let map = this.map = new ol.Map({
            target: mapDom,
            view: new ol.View({
                center: [-85, 35],
                zoom: 1,
                minZoom: 0,
                maxZoom: 16
            }),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM(),
                })
            ]
        });

    }

    addControl(controlView: Marionette.View<any>) {
        if (!this.map) return;
        let positionName = controlView.getOption("position");
        let positionCss = "." + positionName.split(" ").join(" .");
        let controlsDom = this.$(`.map-controls`);
        let controlDom = $(`ol-control ${positionCss}`, controlsDom);
        if (!controlDom.length) {
            let controlDom = $(`<div class="ol-control ${positionName}"></div>`)[0];
            controlsDom.append(controlDom);
            controlView.$el.appendTo(controlDom);

            let control: ol.control.Control;

            let controlType = controlView.getOption("control-type");

            if (controlType && controlType in ol.control) {
                control = new ol.control[controlType]();
            } else {
                control = new ol.control.Control({
                    element: controlDom,
                    render: undefined,
                    target: undefined,
                });
            }

            this.map.addControl(control);
            controlView.render();
        } else {
            debugger;
            // control already exists, use it
        }
    }
}

