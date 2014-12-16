(function (ns) {
    'use strict';

    ns.filters.TitleCaseFilterFactory = function () {
        return function (sentence) {
            if (sentence && sentence.split) {
                var word_arr = sentence.split(" ");
                var new_sentence = '';

                for (var i in word_arr) {
                    new_sentence += word_arr[i].substring(0, 1).toUpperCase() + word_arr[i].slice(1) + " ";
                }
                return new_sentence;
            } else {
                return sentence;
            }
        };
    };

})(ns);





