let data = {
	data: {
		Map: {
			Layers: {
				Layers: [
					{
						Options: {
							Values: [
								{ id: "layerType", value: "osm" },
								{ id: "layerStyle", value: "osm" },
								{ id: "visible", value: "true" }
							]
						},
						id: "mapquest-osm",
						text: "Map Quest",
						type: "app/layer-factory/native",
						basemap: true,
						minlevel: 10,
						maxlevel: 20,
						disabled: false
					}
				]
			},
			Options: {
				Values: [
					{ id: "init-zoom", about: "Zoom into to about 10 block radius", value: "17" },
					{ id: "init-center", about: "Somewhere in Las Vegas", value: "-115.2322,36.1822" },
					{ id: "max-zoom", about: "To be moved to VIEWPORT", value: "19" },
					{ id: "min-zoom", about: "To be moved to VIEWPORT", value: "10" },
					{
						id: "default-interactions",
						about: "See http://openlayers.org/en/latest/apidoc/ol.interaction.html#.defaults",
						value:
							'{\r\n    "altShiftDragRotate": true,\r\n    "doubleClickZoom": true,\r\n    "keyboard": true,\r\n    "mouseWheelZoom": true,\r\n    "shiftDragZoom": true,\r\n    "dragPan": true,\r\n    "pinchRotate": true,\r\n    "pinchZoom": true,\r\n    "zoomDuration": 500\r\n}'
					}
				]
			}
		},
		id: "ControlTest",
		text: "Minimal Maplet",
		Controls: {
			Controls: [
				{
					Controls: {
						Controls: [
							{
								Commands: {
									Commands: [
										{
											id: "geoquery-form-search",
											mid: "app/commands/trigger",
											text: "↴",
											type: "action",
											disabled: false,
											Options: {
												Values: [
													{ id: "event", value: "ags-geoquery-execute" },
													{ id: "trace", value: "true" },
													{ id: "title", value: "Search" }
												]
											}
										},
										{
											id: "clear-features",
											mid: "app/commands/trigger",
											text: "✘",
											type: "action",
											disabled: false,
											Options: {
												Values: [
													{
														id: "event",
														about:
															"clear all features (how to clear only the search results?)",
														value: "clear-features-from-layer"
													},
													{ id: "trace", value: "true" },
													{ id: "title", value: "Clear" }
												]
											}
										}
									]
								},
								Events: {
									Events: [
										{
											name: "ags-geoquery-execute",
											id: "ags-geoquery-processor",
											mid: "app/commands/ags-geoquery-processor",
											type: "geoquery-result",
											disabled: false,
											Options: {
												Values: [
													{ id: "returnGeometry", value: "true" },
													{ id: "returnIdsOnly", value: "false" },
													{ id: "returnCountOnly", value: "false" },
													{ id: "event", value: "military-features-ready,auto-zoom" }
												]
											}
										}
									]
								},
								id: "annotations-search-form",
								mid: "app/controls/ags-geoquery-form-tool",
								text: "Zones",
								disabled: false,
								Options: {
									Values: [
										{
											id: "url",
											about:
												"Draw annotation points (would like to support all annotations, ie. remove the /0 in the value)",
											value:
												"https://usalvwdgis1.infor.com/ags/rest/services/ANNOTATIONS/IPS860_ANNOTATIONS/FeatureServer/0"
										},
										{
											id: "key-template",
											about: "template for rendering a unique key",
											value: "<%=OBJECTID%>"
										},
										{
											id: "blacklist",
											value:
												"last_edited_user,last_edited_date,created_user,created_date,H8MONIK2,expiration,EXPIRED"
										},
										{ id: "css-name", value: "panel form-container" },
										{ id: "region", value: "search-form" }
									]
								}
							}
						]
					},
					id: "map-controls-top-left",
					about: "adds a control to the ol3 map control collection",
					mid: "app/controls/map-panel",
					disabled: false,
					Options: { Values: [{ id: "position", value: "top-1 left-3" }] }
				},
				{
					Controls: {
						Controls: [
							{
								id: "Hello",
								mid: "app/controls/view",
								disabled: false,
								Options: {
									Values: [
										{ id: "template", value: "app/test/templates/hello-world-template" },
										{ id: "model", value: "examples/models/hello-world-model" },
										{ id: "css-name", about: "div.panel uses darker background", value: "panel" },
										{ id: "region", value: "hello-world" }
									]
								}
							}
						]
					},
					id: "map-controls-top-right",
					about: "adds a control to the ol3 map control collection",
					mid: "app/controls/map-panel",
					disabled: false,
					Options: { Values: [{ id: "position", value: "top-1 right-1" }] }
				},
				{
					Controls: {
						Controls: [
							{
								id: "map-scale-line",
								about: "scaleline",
								mid: "app/controls/ol3-control",
								disabled: false,
								Options: {
									Values: [
										{
											id: "control-type",
											about: "identify the ol3 constructor/class",
											value: "ScaleLine"
										},
										{
											id: "className",
											about: "top-left container",
											value: "ol-control ol-scale-line"
										},
										{
											id: "units",
											about:
												"Use imperial measurements (degrees, imperial, nautical, metric, us)",
											value: "us"
										},
										{ id: "region", value: "scale-line" }
									]
								}
							}
						]
					},
					id: " map-controls-bottom-right",
					about: "adds a control to the ol3 map control collection",
					mid: "app/controls/map-panel",
					disabled: false,
					Options: { Values: [{ id: "position", value: "bottom-1 right-3" }] }
				},
				{
					Controls: {
						Controls: [
							{
								Commands: {
									Commands: [
										{
											id: "refresh-grid",
											mid: "app/commands/trigger",
											text: "✘",
											type: "action",
											disabled: false,
											Options: {
												Values: [
													{
														id: "event",
														about:
															"clear all features (how to clear only the search results?)",
														value: "refresh-grid"
													},
													{ id: "trace", value: "true" },
													{ id: "title", value: "Refresh" },
													{ id: "debug", value: "true" }
												]
											}
										}
									]
								},
								Controls: {
									Controls: [
										{
											id: "Hello",
											mid: "app/controls/view",
											disabled: false,
											Options: {
												Values: [
													{
														id: "template",
														value: "app/test/templates/hello-world-template"
													},
													{ id: "model", value: "examples/models/hello-world-model" },
													{
														id: "css-name",
														about: "div.panel uses darker background",
														value: "panel"
													},
													{ id: "region", value: "hello-world" }
												]
											}
										}
									]
								},
								id: "hello-world-grid",
								about: "Renders the military points data in a grid",
								mid: "app/controls/grid",
								disabled: false,
								Options: {
									Values: [
										{ id: "region", value: "results-grid" },
										{ id: "model", value: "examples/models/hello-world-model" },
										{ id: "css-name", about: "Make this the primary results grid", value: "panel" },
										{
											id: "refresh-event",
											about: "Refresh the grid each time the map extent changes",
											value: "refresh-grid"
										}
									]
								}
							}
						]
					},
					id: "map-controls-bottom-left",
					about: "adds a control to the ol3 map control collection",
					mid: "app/controls/map-panel",
					disabled: false,
					Options: { Values: [{ id: "position", value: "bottom-1 left-1" }] }
				}
			]
		},
		Options: {
			Values: [
				{
					id: "css-name",
					about: "loads a custom css to manipulate toolbar layout",
					value: "rhythm-civics-base"
				},
				{ id: "css", about: "stylesheet to load for this maplet", value: "app/css/rhythm-civics-base.css" },
				{
					id: "template",
					about: "Markup for the view and regions",
					value: "app/templates/rhythm-gis-template"
				},
				{ id: "region", about: "Identifies the maplet container", value: "gis-map-region" }
			]
		}
	},
	href: "http://usgvdcalix2/850rs/api/property/agencymaps/ControlTest"
};
let maplet = data.data;
export = maplet;
