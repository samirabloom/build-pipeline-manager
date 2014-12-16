(function (ns) {
    'use strict';

    function SortableDirective($timeout) {
        this.$timeout = $timeout;
    }

    SortableDirective['$inject'] = ['$timeout'];

    SortableDirective.prototype = {

        link: function link(scope, elem, attr) {
            this.$timeout(function () {
                $('.sortable:not(.disabled)').sortable({
                    placeholder: "ui-state-highlight",
                    update: function (event, ui) {
                        var sortedList = [];
                        $(event.target).children().each(function (index) {
                            if ($(this).find('input').size() > 0) {
                                $(this).find('input').each(function () {
                                    sortedList.push({
                                        name: $(this).val()
                                    });
                                });
                            }
                        });
                        scope.list = sortedList;
                        scope.$apply();
                    }
                });
            }, 0);
        }

    };

    ns.directives.SortableDirectiveFactory = function ($timeout) {
        return {
            link: function () {
                var directive = new SortableDirective($timeout);
                directive.link.apply(directive, arguments);
            },
            restrict: 'A',
            scope: {
                list: '=list'
            }
        };
    };

})(ns);





