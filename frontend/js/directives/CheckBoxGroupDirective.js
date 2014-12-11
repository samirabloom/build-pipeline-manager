(function(co) {
	'use strict';

	function CheckBoxGroupDirectiveFactory() {
		return {
			link : function() {
				var directive = new CheckBoxGroupDirective();
				directive.link.apply(directive, arguments);

			},
			restrict: 'A'
		};
	}

	function CheckBoxGroupDirective() {
		
	}

	CheckBoxGroupDirective.prototype = {

		link: function link(scope, elem, attr) {
			var model = attr['model'];
			var property = attr['property'];
			var value = attr['value'];

			// Determine initial checked boxes
			var self = this;

			scope.$watch(model, function(){
				if (scope[model] && scope[model][property].indexOf(value) !== -1) {
					elem[0].checked = true;
				}
				// Update array on click				
				elem.bind('click', function () {
					self._toggleCheckBox(scope, elem, model, property, value);
				});
			});
		},

		_toggleCheckBox: function(scope, elem, model, property, value) {
			if (scope[model]) {
				var index = scope[model][property].indexOf(value);

				// Add if checked
				if (elem[0].checked) {
					if (index === -1) {
						scope[model][property].push(value);
					}
				} else { // Remove if unchecked
					if (index !== -1) {
						scope[model][property].splice(index, 1);
					}
				}
			}
		}


	};

	co.directives.CheckBoxGroupDirectiveFactory = CheckBoxGroupDirectiveFactory;
	co.directives.CheckBoxGroupDirective = CheckBoxGroupDirective;

})(co);





