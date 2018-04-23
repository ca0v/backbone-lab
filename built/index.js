var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
define("index", ["require", "exports"], function (require, exports) {
    "use strict";
    return {};
});
define("app/views/map-view", ["require", "exports", "openlayers", "backbone.marionette"], function (require, exports, openlayers_1, backbone_marionette_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    openlayers_1 = __importDefault(openlayers_1);
    backbone_marionette_1 = __importDefault(backbone_marionette_1);
    class MapView extends backbone_marionette_1.default.View {
        constructor(options) {
            super(options);
            this.template = `<div class="map"><div class="map-controls"></div></div>`;
            this.map = null;
            this.addRegion("controls", ".map-controls");
        }
        onRender() {
            let mapDom = this.el;
            let map = this.map = new openlayers_1.default.Map({
                target: mapDom,
                view: new openlayers_1.default.View({
                    center: [-85, 35],
                    zoom: 1,
                    minZoom: 0,
                    maxZoom: 16
                }),
                layers: [
                    new openlayers_1.default.layer.Tile({
                        source: new openlayers_1.default.source.OSM(),
                    })
                ]
            });
        }
        addControl(controlView) {
            if (!this.map)
                return;
            let positionName = controlView.getOption("position");
            let positionCss = "." + positionName.split(" ").join(" .");
            let controlsDom = this.$(`.map-controls`);
            let controlDom = $(`ol-control ${positionCss}`, controlsDom);
            if (!controlDom.length) {
                let controlDom = $(`<div class="ol-control ${positionName}"></div>`)[0];
                controlsDom.append(controlDom);
                controlView.$el.appendTo(controlDom);
                let control;
                let controlType = controlView.getOption("control-type");
                if (controlType && controlType in openlayers_1.default.control) {
                    control = new openlayers_1.default.control[controlType]();
                }
                else {
                    control = new openlayers_1.default.control.Control({
                        element: controlDom,
                        render: undefined,
                        target: undefined,
                    });
                }
                this.map.addControl(control);
                controlView.render();
            }
            else {
                debugger;
                // control already exists, use it
            }
        }
    }
    exports.MapView = MapView;
});
define("app/views/controls-view", ["require", "exports", "underscore", "backbone.marionette", "backbone"], function (require, exports, _, backbone_marionette_2, backbone_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_marionette_2 = __importDefault(backbone_marionette_2);
    backbone_1 = __importDefault(backbone_1);
    /**
     * Renders a nested control collection using a TreeView
     */
    class ControlView extends backbone_marionette_2.default.View {
        constructor(options = {}) {
            super(options);
            this.template = _.template(`
    <div class="control-view">
        <div class="control-view-body"><%= id %></div>
        <div class="control-commands"></div>
        <div class="children"></div>
    </div>`);
            this.addRegions({
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
                    collection: new backbone_1.default.Collection(commands.Commands.map(c => new backbone_1.default.Model(c))),
                }));
            }
            let controls = this.model.get("Controls");
            if (controls) {
                this.showChildView("children", new ControlsView({
                    collection: new backbone_1.default.Collection(controls.Controls.map(c => new backbone_1.default.Model(c))),
                }));
            }
        }
        getOption(id) {
            let option = super.getOption(id);
            if (typeof option === "undefined") {
                let options = this.model.get("Options").Values.filter(o => o.id === id);
                option = options[0] && options[0].value;
            }
            return option;
        }
    }
    exports.ControlView = ControlView;
    class ControlsView extends backbone_marionette_2.default.CollectionView {
        constructor() {
            super(...arguments);
            this.childView = ControlView;
        }
    }
    exports.ControlsView = ControlsView;
    class CommandsView extends backbone_marionette_2.default.CollectionView {
        constructor() {
            super(...arguments);
            this.childView = CommandView;
        }
    }
    exports.CommandsView = CommandsView;
    class CommandView extends backbone_marionette_2.default.View {
        constructor() {
            super(...arguments);
            this.template = _.template(`<input type="button" class="command" value="<%= id %>" />`);
        }
    }
    exports.CommandView = CommandView;
});
define("app/test/data/configuration", ["require", "exports"], function (require, exports) {
    "use strict";
    let data = { "data": { "Map": { "Layers": { "Layers": [{ "Options": { "Values": [{ "id": "layerType", "value": "osm" }, { "id": "layerStyle", "value": "osm" }, { "id": "visible", "value": "true" }] }, "id": "mapquest-osm", "text": "Map Quest", "type": "app/layer-factory/native", "basemap": true, "minlevel": 10, "maxlevel": 20, "disabled": false }] }, "Options": { "Values": [{ "id": "init-zoom", "about": "Zoom into to about 10 block radius", "value": "17" }, { "id": "init-center", "about": "Somewhere in Las Vegas", "value": "-115.2322,36.1822" }, { "id": "max-zoom", "about": "To be moved to VIEWPORT", "value": "19" }, { "id": "min-zoom", "about": "To be moved to VIEWPORT", "value": "10" }, { "id": "default-interactions", "about": "See http://openlayers.org/en/latest/apidoc/ol.interaction.html#.defaults", "value": "{\r\n    \"altShiftDragRotate\": true,\r\n    \"doubleClickZoom\": true,\r\n    \"keyboard\": true,\r\n    \"mouseWheelZoom\": true,\r\n    \"shiftDragZoom\": true,\r\n    \"dragPan\": true,\r\n    \"pinchRotate\": true,\r\n    \"pinchZoom\": true,\r\n    \"zoomDuration\": 500\r\n}" }] } }, "id": "ControlTest", "text": "Minimal Maplet", "Controls": { "Controls": [{ "Controls": { "Controls": [{ "Commands": { "Commands": [{ "id": "geoquery-form-search", "mid": "app/commands/trigger", "text": "↴", "type": "action", "disabled": false, "Options": { "Values": [{ "id": "event", "value": "ags-geoquery-execute" }, { "id": "trace", "value": "true" }, { "id": "title", "value": "Search" }] } }, { "id": "clear-features", "mid": "app/commands/trigger", "text": "✘", "type": "action", "disabled": false, "Options": { "Values": [{ "id": "event", "about": "clear all features (how to clear only the search results?)", "value": "clear-features-from-layer" }, { "id": "trace", "value": "true" }, { "id": "title", "value": "Clear" }] } }] }, "Events": { "Events": [{ "name": "ags-geoquery-execute", "id": "ags-geoquery-processor", "mid": "app/commands/ags-geoquery-processor", "type": "geoquery-result", "disabled": false, "Options": { "Values": [{ "id": "returnGeometry", "value": "true" }, { "id": "returnIdsOnly", "value": "false" }, { "id": "returnCountOnly", "value": "false" }, { "id": "event", "value": "military-features-ready,auto-zoom" }] } }] }, "id": "annotations-search-form", "mid": "app/controls/ags-geoquery-form-tool", "text": "Zones", "disabled": false, "Options": { "Values": [{ "id": "url", "about": "Draw annotation points (would like to support all annotations, ie. remove the /0 in the value)", "value": "https://usalvwdgis1.infor.com/ags/rest/services/ANNOTATIONS/IPS860_ANNOTATIONS/FeatureServer/0" }, { "id": "key-template", "about": "template for rendering a unique key", "value": "<%=OBJECTID%>" }, { "id": "blacklist", "value": "last_edited_user,last_edited_date,created_user,created_date,H8MONIK2,expiration,EXPIRED" }, { "id": "css-name", "value": "panel form-container" }, { "id": "region", "value": "search-form" }] } }] }, "id": "map-controls-top-left", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "top-1 left-3" }] } }, { "Controls": { "Controls": [{ "id": "Hello", "mid": "app/controls/view", "disabled": false, "Options": { "Values": [{ "id": "template", "value": "app/test/templates/hello-world-template" }, { "id": "model", "value": "app/test/models/hello-world-model" }, { "id": "css-name", "about": "div.panel uses darker background", "value": "panel" }, { "id": "region", "value": "hello-world" }] } }] }, "id": "map-controls-top-right", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "top-1 right-1" }] } }, { "Controls": { "Controls": [{ "id": "map-scale-line", "about": "scaleline", "mid": "app/controls/ol3-control", "disabled": false, "Options": { "Values": [{ "id": "control-type", "about": "identify the ol3 constructor/class", "value": "ScaleLine" }, { "id": "className", "about": "top-left container", "value": "ol-control ol-scale-line" }, { "id": "units", "about": "Use imperial measurements (degrees, imperial, nautical, metric, us)", "value": "us" }, { "id": "region", "value": "scale-line" }] } }] }, "id": " map-controls-bottom-right", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "bottom-1 right-3" }] } }, { "Controls": { "Controls": [{ "Commands": { "Commands": [{ "id": "refresh-grid", "mid": "app/commands/trigger", "text": "✘", "type": "action", "disabled": false, "Options": { "Values": [{ "id": "event", "about": "clear all features (how to clear only the search results?)", "value": "refresh-grid" }, { "id": "trace", "value": "true" }, { "id": "title", "value": "Refresh" }, { "id": "debug", "value": "true" }] } }] }, "Controls": { "Controls": [{ "id": "Hello", "mid": "app/controls/view", "disabled": false, "Options": { "Values": [{ "id": "template", "value": "app/test/templates/hello-world-template" }, { "id": "model", "value": "app/test/models/hello-world-model" }, { "id": "css-name", "about": "div.panel uses darker background", "value": "panel" }, { "id": "region", "value": "hello-world" }] } }] }, "id": "hello-world-grid", "about": "Renders the military points data in a grid", "mid": "app/controls/grid", "disabled": false, "Options": { "Values": [{ "id": "region", "value": "results-grid" }, { "id": "model", "value": "app/test/models/hello-world-model" }, { "id": "css-name", "about": "Make this the primary results grid", "value": "panel" }, { "id": "refresh-event", "about": "Refresh the grid each time the map extent changes", "value": "refresh-grid" }] } }] }, "id": "map-controls-bottom-left", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "bottom-1 left-1" }] } }] }, "Options": { "Values": [{ "id": "css-name", "about": "loads a custom css to manipulate toolbar layout", "value": "rhythm-civics-base" }, { "id": "css", "about": "stylesheet to load for this maplet", "value": "app/css/rhythm-civics-base.css" }, { "id": "template", "about": "Markup for the view and regions", "value": "app/templates/rhythm-gis-template" }, { "id": "region", "about": "Identifies the maplet container", "value": "gis-map-region" }] } }, "href": "http://usgvdcalix2/850rs/api/property/agencymaps/ControlTest" };
    let maplet = data.data;
    return maplet;
});
define("app/test/index", ["require", "exports", "backbone", "app/views/map-view", "app/views/controls-view", "app/test/data/configuration"], function (require, exports, backbone_2, map_view_1, controls_view_1, configuration_1) {
    "use strict";
    backbone_2 = __importDefault(backbone_2);
    configuration_1 = __importDefault(configuration_1);
    function run() {
        let mapDom = document.createElement("div");
        mapDom.className = "fullscreen map";
        document.body.appendChild(mapDom);
        let mapView = new map_view_1.MapView({
            el: mapDom,
        });
        mapView.render();
        let rootControls = configuration_1.default.Controls.Controls.map(c => new backbone_2.default.Model(c));
        let controlViews = rootControls.map(model => new controls_view_1.ControlView({ model: model }));
        controlViews.forEach(controlView => {
            mapView.addControl(controlView);
        });
    }
    return run;
});
//# sourceMappingURL=index.js.map