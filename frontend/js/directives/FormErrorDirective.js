(function(ns) {
    'use strict';

	function FormErrorDirectiveFactory() {
		return {			
			templateUrl : 'views/formError.html',
			restrict: 'E',
			priority: 1001,
			scope: {},
			link: function(scope, elem, attr) {
				scope.fieldName = attr.fieldName;				
				scope.$parent.$watch('errors[\'' + scope.fieldName + '\']', function(){
					scope.fieldErrors = scope.$parent.errors[scope.fieldName];
					if (scope.fieldErrors === undefined) {
						scope.fieldErrors = [];
					} else {
						scope.fieldErrors = scope.fieldErrors.filter(function(item, pos, self) {return self.indexOf(item) === pos;});
					}
				});
			}
		};
	}

	ns.directives.FormErrorDirectiveFactory = FormErrorDirectiveFactory;

})(ns);





