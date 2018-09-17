import Backbone from "backbone";

import _ from "underscore";
class Extensions {}

export class Mediator {
	public extensions: Extensions;
	public model: Backbone.Model;
	public events: Backbone.Events;

	constructor() {
		this.model = new Backbone.Model();
		this.events = _.extend({}, Backbone.Events);
		/// allow ad-hoc associations within the context of this mediator
		this.extensions = new Extensions();
	}
}
