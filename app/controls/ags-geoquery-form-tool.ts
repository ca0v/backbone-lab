import { ControlView } from "../views/controls-view";
import { Controller } from "./base-control";

class View extends ControlView {
	constructor(options?: any) {
		super(options);

		this.template = () => `
        <div>
        <label title="${this.model.getOption("url")}">AGS-GEOQUERY-FORM</label>
        </div>`;

		let events = this.model.commands.map(c => c.getOption("event") || (c.get("id") as string));

		events.forEach(event => {
			this.channel.on(event, () => alert(event));
		});
	}

	render() {
		return super.render();
	}
}

let controller = new Controller({ view: View });

export = controller;
