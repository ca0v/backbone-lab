var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
define("spec/api", ["require", "exports", "backbone", "backbone.marionette", "backbone.radio", "backgrid", "ceylon"], function (require, exports, backbone_1, backbone_marionette_1, backbone_radio_1, Backgrid, ceylon_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_1 = __importDefault(backbone_1);
    backbone_marionette_1 = __importDefault(backbone_marionette_1);
    backbone_radio_1 = __importDefault(backbone_radio_1);
    Backgrid = __importStar(Backgrid);
    ceylon_1 = __importDefault(ceylon_1);
    describe("backbone", () => {
        it("ensures modules exist", () => {
            ceylon_1.default(backbone_1.default).toExist();
            ceylon_1.default(backbone_marionette_1.default).toExist();
            ceylon_1.default(backbone_radio_1.default).toExist();
            ceylon_1.default(Backgrid).toExist();
        });
        it("ensures backbone API", () => {
            [
                backbone_1.default.$,
                backbone_1.default.ajax,
                backbone_1.default.Collection,
                backbone_1.default.Events,
                backbone_1.default.Model,
                backbone_1.default.Radio,
                backbone_1.default.Router,
                backbone_1.default.View
            ].forEach((n, i) => ceylon_1.default(n).toExist(i + ""));
        });
        it("ensures marionette API", () => {
            [
                backbone_marionette_1.default.Application,
                backbone_marionette_1.default.AppRouter,
                backbone_marionette_1.default.Behavior,
                backbone_marionette_1.default.Behaviors,
                backbone_marionette_1.default.CollectionView,
                //Marionette.Container,
                backbone_marionette_1.default.Object,
                backbone_marionette_1.default.Region,
                backbone_marionette_1.default.Renderer
            ].forEach((n, i) => ceylon_1.default(n).toExist(i + ""));
        });
        it("ensures radio API", () => {
            [
                backbone_radio_1.default.Channel,
                //Radio.Commands,
                backbone_radio_1.default.Requests,
                backbone_radio_1.default.VERSION
            ].forEach((n, i) => ceylon_1.default(n).toExist(i + ""));
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
            ].forEach((n, i) => ceylon_1.default(n).toExist(i + ""));
        });
    });
});
define("spec/backbone-test", ["require", "exports", "backbone", "ceylon"], function (require, exports, backbone_2, ceylon_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    backbone_2 = __importStar(backbone_2);
    ceylon_2 = __importDefault(ceylon_2);
    describe("backbone", () => {
        it("create a backbone model", () => {
            let model = new backbone_2.default.Model({ name: "backbone" });
            let d = backbone_2.default.$.Deferred();
            model.once("change", () => {
                ceylon_2.default(model.get("name")).toEqual("backbone-test");
                model.destroy();
                d.resolve();
            });
            model.set("name", "backbone-test");
            return d;
        });
        it("create a backbone collection", done => {
            let collection = new backbone_2.default.Collection();
            let models = [1, 2].map(n => new backbone_2.Model({ name: "backbone", id: n }));
            collection.once("update", () => {
                ceylon_2.default(collection.isEmpty()).toBeFalse("has two models");
                collection.once("update", () => {
                    ceylon_2.default(collection.isEmpty()).toBeTrue("collection is empty");
                    done();
                });
                collection.remove(models);
            });
            collection.add(models);
        }).timeout(10);
    });
});
define("index", ["require", "exports", "spec/api", "spec/backbone-test"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
//# sourceMappingURL=tests.max.js.map