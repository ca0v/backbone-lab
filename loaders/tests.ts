(() => {
	function cssin(css: string) {
		let styleTag = document.createElement("style");
		styleTag.type = "text/css";
		document.body.appendChild(styleTag);
		styleTag.appendChild(document.createTextNode(css));
	}

	function loadCss(url: string) {
		let link = document.createElement("link");
		link.type = "text/css";
		link.rel = "stylesheet";
		link.href = url;
		document.getElementsByTagName("head")[0].appendChild(link);
	}

	function getParameterByName(name: string, url?: string) {
		url = url || window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return "";
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	let isTest = !!getParameterByName("test");
	let isRun = !!getParameterByName("run");
	if (isTest && isRun) isRun = false;

	let debug = getParameterByName("debug") === "1";
	let localhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
	localhost = localhost && getParameterByName("localhost") !== "0";
	let dark = getParameterByName("theme") === "dark";

	document.body.classList.toggle("dark", dark);
	document.body.classList.toggle("verbose", !localhost);
	document.body.classList.toggle("light", !dark);
	document.body.classList.toggle("terse", localhost && !debug);

	let deps = [] as Array<string>;
	isTest && deps.push("../tests.max");
	isRun && deps.push("../examples.max");
	if (!isTest && !isRun) {
		deps.push("../tests.max");
		deps.push("../examples.max");
	}

	loadCss(
		localhost ? "../node_modules/mocha/mocha.css" : "https://cdnjs.cloudflare.com/ajax/libs/mocha/5.2.0/mocha.css"
	);
	loadCss(
		localhost
			? "../../static/ol/v5.1.3/ol.css"
			: "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/css/ol.css"
	);

	if (isTest) {
		cssin(`map, .map { position: initial; width: 400px; height: 400px; border: 1px solid black;}`);
	}

	if (isRun) {
		cssin(`head,body,.map {
			position: absolute;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
		}
		
		`);
	}

	// setup require js packaging system and load the "spec" before running mocha
	requirejs.config({
		shim: {
			// no need to wrap ol in a define method when using a shim
			// build this using the "npm run build-legacy" (see ol package.json)
			openlayers: {
				deps: [], // no dependencies, needs path to indicate where to find "openlayers"
				exports: "ol" // tell requirejs which global this library defines
			}
		},
		paths: {
			backbone: localhost
				? "../../node_modules/backbone/backbone"
				: "https://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.3.3/backbone-min",
			"backbone.radio": localhost
				? "../../node_modules/backbone.radio/build/backbone.radio"
				: "https://cdnjs.cloudflare.com/ajax/libs/backbone.radio/2.0.0/backbone.radio.min",
			"backbone.marionette": localhost
				? "../../node_modules/backbone.marionette/lib/backbone.marionette"
				: "https://cdnjs.cloudflare.com/ajax/libs/backbone.marionette/3.5.1/backbone.marionette.min",
			jquery: "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min",
			underscore: "https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.9.0/underscore-min",
			openlayers: localhost
				? "../../static/ol/v5.1.3/ol"
				: "https://cdn.rawgit.com/openlayers/openlayers.github.io/master/en/v5.1.3/build/ol"
		},
		packages: [
			{
				name: "backgrid",
				location: localhost
					? "../../node_modules/backgrid/lib"
					: "https://cdn.rawgit.com/cloudflare/backgrid/0.3.8/lib",
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

		callback: () => {
			if (isRun) {
				let testNames = getParameterByName("run") || "*";
				if (testNames === "*") testNames = "examples/index";
				{
					// examples expect map div to already exist
					let map = document.createElement("div");
					map.className = map.id = "map";
					document.body.appendChild(map);
				}
				requirejs(testNames.split(","), (...tests) =>
					tests.forEach(test => {
						if (test.run) {
							test.run();
						} else {
							document.writeln(Object.keys(test).join("<br/>"));
						}
					})
				);
			}
			if (isTest) {
				let testNames = getParameterByName("test") || "*";
				if (testNames === "*") testNames = "tests/index";
				requirejs(["mocha"], () => {
					// window.Mocha is a
					let Mocha = (<any>window)["mocha"];
					let mocha = Mocha.setup({
						timeout: 5000,
						ui: "bdd",
						bail: debug
					});
					console.log(mocha);

					// mocha is putting out globals...hide them (should only be when running as CLI so not sure what's happening)
					define("mocha", [], () => ({ describe, it }));

					// execute "describe" and "it" methods before running mocha
					requirejs(testNames.split(","), () => mocha.run());
				});
			}
			if (!isRun && !isTest) {
				let mids = Object.keys((<any>requirejs).s.contexts._.registry);
				let examples = mids.filter(m => 0 === m.indexOf("examples/")).filter(n => -1 === n.indexOf("/extras/"));
				let tests = mids.filter(m => 0 === m.indexOf("tests/")).filter(n => -1 === n.indexOf("/extras/"));
				console.log(examples, tests);
				examples = examples.map(n => `<a href="${location}${location.search ? "&" : "?"}run=${n}">${n}</a>`);
				tests = tests.map(n => `<a href="${location}${location.search ? "&" : "?"}test=${n}">${n}</a>`);
				document.body.innerHTML = `
				<label>Examples</label>
				<div>${examples.join("<br/>")}</div>
				<br/>
				<label>Tests</label>
				<div>${tests.join("<br/>")}</div>
				`;
			}
		}
	});
})();
