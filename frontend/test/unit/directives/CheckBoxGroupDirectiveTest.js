(function ()
{
    'use strict';

    describe('CheckBoxGroupDirective', function ()
    {

        it('should add checkbox value to list when checkbox is checked', function ()
        {
            //given            
            var model = 'model';
            var property = 'property';
            var value = 'value';

            //and
            var attr = {};
            attr[model] = model;
            attr[property] = property;
            attr[value] = value;

            //and  
            var scope = {};
            scope[model] = {};
            scope[model][property] = [];

            var mockElemet = [
                {
                    checked: true
                }
            ];

            //and
            var directive = new ns.directives.CheckBoxGroupDirective();

            //when
            directive._toggleCheckBox(scope, mockElemet, model, property, value);

            //then            
            expect(scope[model][property]).toEqual([value]);
        });


        it('should remove checkbox value to list when checkbox is unchecked', function ()
        {
            //given            
            var model = 'model';
            var property = 'property';
            var value = 'value';

            //and
            var attr = {};
            attr[model] = model;
            attr[property] = property;
            attr[value] = value;

            //and  
            var scope = {};
            scope[model] = {};
            scope[model][property] = [value];

            var mockElemet = [
                {
                    checked: false
                }
            ];

            //and
            var directive = new ns.directives.CheckBoxGroupDirective();

            //when
            directive._toggleCheckBox(scope, mockElemet, model, property, value);

            //then            
            expect(scope[model][property]).toEqual([]);
        });

    });
})();
