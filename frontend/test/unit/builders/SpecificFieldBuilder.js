(function(co){

	'use strict';

	function SpecificFieldBuilder() {

	}

	SpecificFieldBuilder.prototype = {

		withType : function(type) {
			this.type = type;
			return this;
		},

		withName : function(name) {
			this.name = name;
			return this;
		},

		withLabel : function(label) {
			this.label = label;
			return this;
		},

		build : function() {
			return {
				'type' : this.type,
				'name' : this.name,
				'label' : this.label
			};
		}

	};

	co.builders.SpecificFieldBuilder = SpecificFieldBuilder;

})(co);