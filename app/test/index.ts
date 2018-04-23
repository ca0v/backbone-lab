import ol from "openlayers";
import Marionette from "backbone.marionette";
import maplet from "./data/configuration";

class MapView extends Marionette.View<any> {
    template = false;

    constructor(options: any) {
        super(options);
        this.addRegion("map-region", "ol-map");
    }

    onRender() {
        let map = new ol.Map({
            target: this.el,
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
}

function run() {
    maplet.Controls.Controls.forEach(c => {
        console.log(c.id);
    });

    let mapDom = document.createElement("div");
    mapDom.className = "fullscreen map";
    document.body.appendChild(mapDom);

    let view = new MapView({
        el: mapDom,
    });

    view.render();
}

export = run;