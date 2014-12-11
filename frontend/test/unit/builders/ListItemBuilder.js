(function(co){

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

	co.builders.ListItemBuilder = ListItemBuilder;

	/*

	var ListItemBuilder = co.builders.ListItemBuilder;
    console.log([
            new ListItemBuilder().withKey('GBP').withValue('Pound').build(),
            new ListItemBuilder().withKey('EUR').withValue('Euro').build(),
            new ListItemBuilder().withKey('USD').withValue('Dollar').build()
    ]);

	*/

})(co);