(function(ns){

	'use strict';

	function ListItemBuilder() {

	}

	ListItemBuilder.prototype = {

		withKey : function(key) {
			this.key = key;
			return this;
		},

		withValue : function(value) {
			this.value = value;
			return this;
		},

		build : function() {
			return {
				'key' : this.key,
				'value' : this.value
			};
		}

	};

	ns.builders.ListItemBuilder = ListItemBuilder;

})(ns);