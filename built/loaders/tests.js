"use strict";
(function () {
    function cssin(css) {
        var styleTag = document.createElement("style");
        styleTag.type = "text/css";
        document.body.appendChild(styleTag);
        styleTag.appendChild(document.createTextNode(css));
    }
    function loadCss(url) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = url;
        document.getElementsByTagName("head")[0].appendChild(link);
    }
    function getParameterByName(name, url) {
        url = url || window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"), results = regex.exec(url);
        if (!results)
            return null;
        if (!results[2])
            return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }
    var isTest = !!getParameterByName("test");
    var isRun = !!getParameterByName("run");
    if (isTest && isRun)
        isRun = false;
    var debug = getParameterByName("debug") === "1";
    var localhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    localhost = false;
    var dark = getParameterByName("theme") === "dark";
    document.body.classList.toggle("dark", dark);
    document.body.classList.toggle("verbose", !localhost);
    document.body.classList.toggle("light", !dark);
    document.body.classList.toggle("terse", localhost && !debug);
    var deps = [];
    isTest && deps.push("../tests.max");
    isRun && deps.push("../examples.max");
    if (!isTest && !isRun) {
        deps.push("../tests.max");
        deps.push("../examples.max");
    }
    loadCss(localhost ? "../node_modules/mocha/mocha.css" : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0/mocha.css");
    loadCss(localhost
        ? "../../static/ol/v5.1.3/ol.css"
        : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/css/ol.css");
    if (isTest) {
        cssin("map, .map { position: initial; width: 400px; height: 400px; border: 1px solid black;}");
    }
    if (isRun) {
        cssin("head,body,.map {\n\t\t\tposition: absolute;\n\t\t\ttop: 0;\n\t\t\tleft: 0;\n\t\t\tbottom: 0;\n\t\t\tright: 0;\n\t\t}\n\t\t\n\t\t");
    }
    // setup require js packaging system and load the "spec" before running mocha
    requirejs.config({
        shim: {
            // no need to wrap ol in a define method when using a shim
            // build this using the "npm run build-legacy" (see ol package.json)
            openlayers: {
                deps: [],
                exports: "ol" // tell requirejs which global this library defines
            }
        },
        paths: {
            backbone: localhost
                ? "../../node_modules/backbone/backbone"
                : "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min",
            "backbone.radio": "https://cdnjs.cloudflare.com/ajax/libs/backbone.radio/2.0.0/backbone.radio.min",
            "backbone.marionette": "https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/3.5.1/backbone.marionette.min",
            jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min",
            underscore: "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore-min",
            openlayers: localhost
                ? "../../static/ol/v5.1.3/ol"
                : "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/build/ol"
        },
        packages: [
            {
                name: "ceylon",
                location: localhost
                    ? "../../node_modules/ceylon/lib/umd"
                    : "https://unpkg.com/ceylon/lib/umd/ceylon.min",
                main: "ceylon"
            },
            {
                name: "backgrid",
                location: localhost ? "../../node_modules/backgrid/lib" : "todo",
                main: "backgrid"
            },
            {
                name: "jquery",
                location: localhost ? "../../node_modules/jquery" : "https://code.jquery.com",
                main: localhost ? "dist/jquery.min" : "jquery-3.3.1.min"
            },
            {
                name: "mocha",
                location: localhost ? "../../node_modules/mocha" : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0",
                main: localhost ? "mocha" : "mocha.min"
            }
        ],
        deps: deps,
        callback: function () {
            if (isRun) {
                var testNames = getParameterByName("run") || "*";
                if (testNames === "*")
                    testNames = "examples/index";
                {
                    // examples expect map div to already exist
                    var map = document.createElement("div");
                    map.className = map.id = "map";
                    document.body.appendChild(map);
                }
                requirejs(testNames.split(","), function () {
                    var tests = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        tests[_i] = arguments[_i];
                    }
                    return tests.forEach(function (test) { return test.run(); });
                });
            }
            if (isTest) {
                var testNames_1 = getParameterByName("test") || "*";
                if (testNames_1 === "*")
                    testNames_1 = "tests/index";
                requirejs(["mocha"], function () {
                    // window.Mocha is a
                    var Mocha = window["mocha"];
                    var mocha = Mocha.setup({
                        timeout: 5000,
                        ui: "bdd",
                        bail: debug
                    });
                    console.log(mocha);
                    // mocha is putting out globals...hide them (should only be when running as CLI so not sure what's happening)
                    define("mocha", [], function () { return ({ describe: describe, it: it }); });
                    // execute "describe" and "it" methods before running mocha
                    requirejs(testNames_1.split(","), function () { return mocha.run(); });
                });
            }
            if (!isRun && !isTest) {
                var mids = Object.keys(requirejs.s.contexts._.registry);
                var examples = mids.filter(function (m) { return 0 === m.indexOf("examples/"); }).filter(function (n) { return -1 === n.indexOf("/extras/"); });
                var tests = mids.filter(function (m) { return 0 === m.indexOf("tests/"); }).filter(function (n) { return -1 === n.indexOf("/extras/"); });
                console.log(examples, tests);
                examples = examples.map(function (n) { return "<a href=\"" + location + (location.search ? "&" : "?") + "run=" + n + "\">" + n + "</a>"; });
                tests = tests.map(function (n) { return "<a href=\"" + location + (location.search ? "&" : "?") + "test=" + n + "\">" + n + "</a>"; });
                document.body.innerHTML = "\n\t\t\t\t<label>Examples</label>\n\t\t\t\t<div>" + examples.join("<br/>") + "</div>\n\t\t\t\t<br/>\n\t\t\t\t<label>Tests</label>\n\t\t\t\t<div>" + tests.join("<br/>") + "</div>\n\t\t\t\t";
            }
        }
    });
})();
