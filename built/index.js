var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define("index", ["require", "exports"], function (require, exports) {
    "use strict";
    return {};
});
define("app/models/command-model", ["require", "exports", "backbone"], function (require, exports, backbone_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_1 = __importDefault(backbone_1);
    class CommandModel extends backbone_1.default.Model {
        get id() {
            return this.get("id");
        }
        get Options() {
            return this.get("Options");
        }
    }
    exports.CommandModel = CommandModel;
    class CommandCollection extends backbone_1.default.Collection {
        constructor() {
            super(...arguments);
            this.model = CommandModel;
        }
    }
    exports.CommandCollection = CommandCollection;
});
define("app/models/control-model", ["require", "exports", "backbone"], function (require, exports, backbone_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_2 = __importDefault(backbone_2);
    class ControlModel extends backbone_2.default.Model {
        get id() {
            return this.get("id");
        }
        get mid() {
            return this.get("mid");
        }
        get commands() {
            return this.get("Commands");
        }
        get controls() {
            return this.get("Controls");
        }
        get options() {
            let v = this.get("Options");
            return (v && v.Values);
        }
        getOption(id) {
            let options = this.options;
            if (options) {
                let value = options.find(n => n.id === id);
                return (value && value.value);
            }
            return undefined;
        }
    }
    exports.ControlModel = ControlModel;
    class ControlCollection extends backbone_2.default.Collection {
        constructor() {
            super(...arguments);
            this.model = ControlModel;
        }
    }
    exports.ControlCollection = ControlCollection;
});
define("app/views/commands-view", ["require", "exports", "underscore", "backbone.marionette"], function (require, exports, _, backbone_marionette_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_marionette_1 = __importDefault(backbone_marionette_1);
    class CommandsView extends backbone_marionette_1.default.CollectionView {
        constructor() {
            super(...arguments);
            this.childView = CommandView;
        }
    }
    exports.CommandsView = CommandsView;
    class CommandView extends backbone_marionette_1.default.View {
        constructor() {
            super(...arguments);
            this.template = _.template(`<input type="button" class="command <%= id %>" value="<%= id %>" />`);
        }
    }
    exports.CommandView = CommandView;
});
define("app/views/controls-view", ["require", "exports", "underscore", "backbone.marionette", "app/views/commands-view"], function (require, exports, _, backbone_marionette_2, commands_view_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_marionette_2 = __importDefault(backbone_marionette_2);
    /**
     * Renders a nested control collection using a TreeView
     */
    class ControlView extends backbone_marionette_2.default.View {
        constructor(options = {}) {
            super(options);
            this.template = _.template(`
    <div class="control-view <%= id %>">
        <div class="placeholder"></div>
        <div class="control-commands"></div>
        <div class="children"></div>
    </div>`);
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
                this.showChildView("commands", new commands_view_1.CommandsView({
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
        getOption(id) {
            let option = super.getOption(id);
            if (typeof option === "undefined") {
                return this.model.getOption(id);
            }
            return option;
        }
    }
    exports.ControlView = ControlView;
    class ControlsView extends backbone_marionette_2.default.CollectionView {
        constructor(options) {
            super(options);
            this.childView = ControlView;
        }
        buildChildView(child, childViewClass, childViewOptions) {
            // the child "mid" can be instantiated and rendered inside this placeholder-view
            let childView = new childViewClass(_.extend({
                controller: this.getOption("controller"),
                model: child
            }, childViewOptions));
            let mid = child.mid;
            if (mid) {
                requirejs([mid], (controller) => {
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
    exports.ControlsView = ControlsView;
});
define("app/controls/base-control", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Controller {
        constructor(options) {
            this.options = options;
        }
        createView(options) {
            let d = $.Deferred();
            let viewMid = options.model.getOption("view");
            if (viewMid) {
                requirejs([viewMid], (View) => {
                    let view = new View(options);
                    d.resolve(view);
                });
            }
            else {
                console.log("no view module identify is not defined");
                let view = new this.options.view(options);
                d.resolve(view);
            }
            return d;
        }
    }
    exports.Controller = Controller;
});
define("app/controls/ags-geoquery-form-tool", ["require", "exports", "underscore", "app/views/controls-view", "app/controls/base-control"], function (require, exports, _, controls_view_1, base_control_1) {
    "use strict";
    class View extends controls_view_1.ControlView {
        constructor() {
            super(...arguments);
            this.template = _.template("<div><label>AGS-GEOQUERY-FORM</label></div>");
        }
    }
    let controller = new base_control_1.Controller({ view: View });
    return controller;
});
define("app/controls/grid", ["require", "exports", "underscore", "app/views/controls-view", "app/controls/base-control"], function (require, exports, _, controls_view_2, base_control_2) {
    "use strict";
    class View extends controls_view_2.ControlView {
        constructor() {
            super(...arguments);
            this.template = _.template(`<div class="grid"><label>GRID</label></div>`);
        }
    }
    let controller = new base_control_2.Controller({ view: View });
    return controller;
});
define("app/controls/ol3-control", ["require", "exports", "openlayers", "underscore", "app/views/controls-view", "app/controls/base-control"], function (require, exports, openlayers_1, _, controls_view_3, base_control_3) {
    "use strict";
    openlayers_1 = __importDefault(openlayers_1);
    class View extends controls_view_3.ControlView {
        constructor() {
            super(...arguments);
            this.template = _.template(`<div class="ol-control"></div>`);
        }
        onRender() {
            let map = this.getOption("controller").model.get("map");
            let controlType = this.getOption("control-type");
            let ControlConstructor = openlayers_1.default.control[controlType];
            if (ControlConstructor) {
                let control = new ControlConstructor({
                    target: this.$el[0],
                });
                map.addControl(control);
            }
        }
    }
    let controller = new base_control_3.Controller({ view: View });
    return controller;
});
define("app/controls/view", ["require", "exports", "underscore", "app/views/controls-view"], function (require, exports, _, controls_view_4) {
    "use strict";
    class View extends controls_view_4.ControlView {
        constructor() {
            super(...arguments);
            this.template = _.template("<div><label>DEFAULT VIEW</label></div>");
        }
    }
    function createView(options) {
        let d = $.Deferred();
        let view = new View(options);
        d.resolve(view);
        return d;
    }
    return {
        createView: createView
    };
});
define("app/views/map-view", ["require", "exports", "openlayers", "backbone.marionette"], function (require, exports, openlayers_2, backbone_marionette_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    openlayers_2 = __importDefault(openlayers_2);
    backbone_marionette_3 = __importDefault(backbone_marionette_3);
    class MapView extends backbone_marionette_3.default.View {
        constructor(options) {
            super(options);
            this.template = `<div class="map"><div class="map-controls"></div></div>`;
            this.map = null;
            this.addRegion("controls", ".map-controls");
        }
        onRender() {
            let mapDom = this.el;
            let map = this.map = new openlayers_2.default.Map({
                target: mapDom,
                view: new openlayers_2.default.View({
                    center: this.model.get("center"),
                    zoom: this.model.get("zoom"),
                    minZoom: 0,
                    maxZoom: 16
                }),
                layers: [
                    new openlayers_2.default.layer.Tile({
                        source: new openlayers_2.default.source.OSM(),
                    })
                ]
            });
            this.model.set("map", map);
        }
        addControl(controlView) {
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
                let control = new openlayers_2.default.control.Control({
                    element: controlDom,
                    render: (event) => {
                        console.log(event);
                        controlView.trigger("event", event);
                    },
                    target: undefined,
                });
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
define("app/test/data/configuration", ["require", "exports"], function (require, exports) {
    "use strict";
    let data = { "data": { "Map": { "Layers": { "Layers": [{ "Options": { "Values": [{ "id": "layerType", "value": "osm" }, { "id": "layerStyle", "value": "osm" }, { "id": "visible", "value": "true" }] }, "id": "mapquest-osm", "text": "Map Quest", "type": "app/layer-factory/native", "basemap": true, "minlevel": 10, "maxlevel": 20, "disabled": false }] }, "Options": { "Values": [{ "id": "init-zoom", "about": "Zoom into to about 10 block radius", "value": "17" }, { "id": "init-center", "about": "Somewhere in Las Vegas", "value": "-115.2322,36.1822" }, { "id": "max-zoom", "about": "To be moved to VIEWPORT", "value": "19" }, { "id": "min-zoom", "about": "To be moved to VIEWPORT", "value": "10" }, { "id": "default-interactions", "about": "See http://openlayers.org/en/latest/apidoc/ol.interaction.html#.defaults", "value": "{\r\n    \"altShiftDragRotate\": true,\r\n    \"doubleClickZoom\": true,\r\n    \"keyboard\": true,\r\n    \"mouseWheelZoom\": true,\r\n    \"shiftDragZoom\": true,\r\n    \"dragPan\": true,\r\n    \"pinchRotate\": true,\r\n    \"pinchZoom\": true,\r\n    \"zoomDuration\": 500\r\n}" }] } }, "id": "ControlTest", "text": "Minimal Maplet", "Controls": { "Controls": [{ "Controls": { "Controls": [{ "Commands": { "Commands": [{ "id": "geoquery-form-search", "mid": "app/commands/trigger", "text": "↴", "type": "action", "disabled": false, "Options": { "Values": [{ "id": "event", "value": "ags-geoquery-execute" }, { "id": "trace", "value": "true" }, { "id": "title", "value": "Search" }] } }, { "id": "clear-features", "mid": "app/commands/trigger", "text": "✘", "type": "action", "disabled": false, "Options": { "Values": [{ "id": "event", "about": "clear all features (how to clear only the search results?)", "value": "clear-features-from-layer" }, { "id": "trace", "value": "true" }, { "id": "title", "value": "Clear" }] } }] }, "Events": { "Events": [{ "name": "ags-geoquery-execute", "id": "ags-geoquery-processor", "mid": "app/commands/ags-geoquery-processor", "type": "geoquery-result", "disabled": false, "Options": { "Values": [{ "id": "returnGeometry", "value": "true" }, { "id": "returnIdsOnly", "value": "false" }, { "id": "returnCountOnly", "value": "false" }, { "id": "event", "value": "military-features-ready,auto-zoom" }] } }] }, "id": "annotations-search-form", "mid": "app/controls/ags-geoquery-form-tool", "text": "Zones", "disabled": false, "Options": { "Values": [{ "id": "url", "about": "Draw annotation points (would like to support all annotations, ie. remove the /0 in the value)", "value": "https://usalvwdgis1.infor.com/ags/rest/services/ANNOTATIONS/IPS860_ANNOTATIONS/FeatureServer/0" }, { "id": "key-template", "about": "template for rendering a unique key", "value": "<%=OBJECTID%>" }, { "id": "blacklist", "value": "last_edited_user,last_edited_date,created_user,created_date,H8MONIK2,expiration,EXPIRED" }, { "id": "css-name", "value": "panel form-container" }, { "id": "region", "value": "search-form" }] } }] }, "id": "map-controls-top-left", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "top-1 left-3" }] } }, { "Controls": { "Controls": [{ "id": "Hello", "mid": "app/controls/view", "disabled": false, "Options": { "Values": [{ "id": "template", "value": "app/test/templates/hello-world-template" }, { "id": "model", "value": "app/test/models/hello-world-model" }, { "id": "css-name", "about": "div.panel uses darker background", "value": "panel" }, { "id": "region", "value": "hello-world" }] } }] }, "id": "map-controls-top-right", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "top-1 right-1" }] } }, { "Controls": { "Controls": [{ "id": "map-scale-line", "about": "scaleline", "mid": "app/controls/ol3-control", "disabled": false, "Options": { "Values": [{ "id": "control-type", "about": "identify the ol3 constructor/class", "value": "ScaleLine" }, { "id": "className", "about": "top-left container", "value": "ol-control ol-scale-line" }, { "id": "units", "about": "Use imperial measurements (degrees, imperial, nautical, metric, us)", "value": "us" }, { "id": "region", "value": "scale-line" }] } }] }, "id": " map-controls-bottom-right", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "bottom-1 right-3" }] } }, { "Controls": { "Controls": [{ "Commands": { "Commands": [{ "id": "refresh-grid", "mid": "app/commands/trigger", "text": "✘", "type": "action", "disabled": false, "Options": { "Values": [{ "id": "event", "about": "clear all features (how to clear only the search results?)", "value": "refresh-grid" }, { "id": "trace", "value": "true" }, { "id": "title", "value": "Refresh" }, { "id": "debug", "value": "true" }] } }] }, "Controls": { "Controls": [{ "id": "Hello", "mid": "app/controls/view", "disabled": false, "Options": { "Values": [{ "id": "template", "value": "app/test/templates/hello-world-template" }, { "id": "model", "value": "app/test/models/hello-world-model" }, { "id": "css-name", "about": "div.panel uses darker background", "value": "panel" }, { "id": "region", "value": "hello-world" }] } }] }, "id": "hello-world-grid", "about": "Renders the military points data in a grid", "mid": "app/controls/grid", "disabled": false, "Options": { "Values": [{ "id": "region", "value": "results-grid" }, { "id": "model", "value": "app/test/models/hello-world-model" }, { "id": "css-name", "about": "Make this the primary results grid", "value": "panel" }, { "id": "refresh-event", "about": "Refresh the grid each time the map extent changes", "value": "refresh-grid" }] } }] }, "id": "map-controls-bottom-left", "about": "adds a control to the ol3 map control collection", "mid": "app/controls/map-panel", "disabled": false, "Options": { "Values": [{ "id": "position", "value": "bottom-1 left-1" }] } }] }, "Options": { "Values": [{ "id": "css-name", "about": "loads a custom css to manipulate toolbar layout", "value": "rhythm-civics-base" }, { "id": "css", "about": "stylesheet to load for this maplet", "value": "app/css/rhythm-civics-base.css" }, { "id": "template", "about": "Markup for the view and regions", "value": "app/templates/rhythm-gis-template" }, { "id": "region", "about": "Identifies the maplet container", "value": "gis-map-region" }] } }, "href": "http://usgvdcalix2/850rs/api/property/agencymaps/ControlTest" };
    let maplet = data.data;
    return maplet;
});
define("app/test/index", ["require", "exports", "backbone", "app/views/map-view", "app/views/controls-view", "app/models/control-model", "app/test/data/configuration", "app/models/command-model"], function (require, exports, backbone_3, map_view_1, controls_view_5, control_model_1, configuration_1, command_model_1) {
    "use strict";
    backbone_3 = __importDefault(backbone_3);
    configuration_1 = __importDefault(configuration_1);
    class MapletConverter {
        asModel() {
            let mapletControls = configuration_1.default.Controls.Controls.map(c => this.asControlModel(c));
            return {
                controls: new control_model_1.ControlCollection(mapletControls)
            };
        }
        asCommandModel(command) {
            return new command_model_1.CommandModel(command);
        }
        asControlModel(control) {
            let commandCollection = new command_model_1.CommandCollection();
            let controlCollection = new control_model_1.ControlCollection();
            let result = new control_model_1.ControlModel({
                id: control.id,
                mid: control.mid,
                Controls: controlCollection,
                Commands: commandCollection,
                Options: control.Options,
            });
            if (control.Commands) {
                control.Commands.Commands.forEach(c => {
                    let childModel = this.asCommandModel(c);
                    commandCollection.add(childModel);
                });
            }
            if (control.Controls) {
                control.Controls.Controls.forEach(c => {
                    let childModel = this.asControlModel(c);
                    controlCollection.add(childModel);
                });
            }
            return result;
        }
    }
    function asModel(control) {
        let controls = control.controls;
        if (controls) {
            control.set("Controls", {
                Controls: controls.map(c => asModel(c))
            });
        }
    }
    function run() {
        let mapDom = document.createElement("div");
        mapDom.className = "fullscreen map";
        document.body.appendChild(mapDom);
        let mapView = new map_view_1.MapView({
            el: mapDom,
            model: new backbone_3.default.Model({
                zoom: 5,
                center: [-85, 35]
            }),
        });
        mapView.render();
        let converter = new MapletConverter();
        let rootControls = converter.asModel().controls;
        // how will the views find the map?  Assign the mapView as the controller.
        let controlViews = rootControls.map(model => {
            let view = new controls_view_5.ControlView({
                model: model,
                controller: mapView
            });
            return view;
        });
        controlViews.forEach(controlView => {
            mapView.addControl(controlView);
        });
    }
    return run;
});
define("app/test/simple", ["require", "exports", "underscore", "backbone.marionette"], function (require, exports, underscore_1, backbone_marionette_4) {
    "use strict";
    underscore_1 = __importDefault(underscore_1);
    backbone_marionette_4 = __importDefault(backbone_marionette_4);
    class ParentView extends backbone_marionette_4.default.View {
        constructor(options = {}) {
            options = underscore_1.default.defaults(options, {
                tagName: "h1",
                template: underscore_1.default.template(`<label>Hello <placeholder/>!</label>`),
                regions: {
                    "placeholder": {
                        el: "placeholder",
                        replaceElement: true,
                    }
                }
            });
            super(options);
        }
    }
    class ChildView extends backbone_marionette_4.default.View {
        constructor(options = {}) {
            options = underscore_1.default.defaults(options, {
                tagName: "b",
                template: underscore_1.default.template(`World`),
            });
            super(options);
        }
    }
    function run() {
        let parentElement = document.createElement("div");
        document.body.appendChild(parentElement);
        let parentView = new ParentView({
            el: parentElement
        });
        let childView = new ChildView();
        parentView.getRegion("placeholder").show(childView);
    }
    return run;
});
//# sourceMappingURL=index.js.map