(function ()
{
    'use strict';

    var testConfig = require('../../../build/testConfig.js');
    var mockServerClient = require("mockserver-client").mockServerClient("localhost", testConfig.MOCK_SERVER_PORT);

    describe('list builds', function ()
    {
        var ptor = protractor.getInstance();
        var builds;

        beforeEach(function ()
        {
            builds = {
                'builds' : [
                    {'name': 'CHOMP-CASINO', 'id': '1'},
                    {'name': 'GOWIN-CASINO', 'id': '2'},
                    {'name': 'LEO-VEGAS-CASINO', 'id': '3'},
                    {'name': 'RED8-CASINO', 'id': '4'},
                    {'name': 'WINZINO-CASINO', 'id': '5'}
                ]
            };

            mockServerClient.mockSimpleResponse('/buildManager/build', builds, 200);
        });

        it('should display list', function ()
        {
            //when
            ptor.get('#/').then(function ()
            {
                // debugger;
            });

            element.all(by.id('buildsLink')).click();

            //then
            expect(element.all(by.css('h1')).first().getText()).toMatch("Builds");

            element.all(by.css('.buildItem')).then(function (tableRows)
            {
                //and
                expect(tableRows.length).toBe(5);

                tableRows.forEach(function (row, i)
                {
                    row.all(by.css('.buildItem__cell')).then(function (columns)
                    {
                        //and
                        expect(columns.length).toBe(3);

                        expect(columns[0].getText()).toEqual(builds[i].id);
                        expect(columns[1].getText()).toEqual(builds[i].name);

                        columns[2].all(by.css('.buildItem__input')).then(function (links)
                        {
                            //and
                            expect(links.length).toBe(3);

                            expect(links[0].getText()).toEqual('Slots Games');
                            expect(links[0].getAttribute('href')).toEqual(ptor.baseUrl + 'console/slots/gameconfiguration/list?buildIdFilter=' + builds[i].id + '&csrfToken=${csrfToken}');

                            expect(links[1].getText()).toEqual('View');
                            expect(links[1].getAttribute('href')).toEqual('#/build/view/' + builds[i].id);

                            expect(links[2].getText()).toEqual('Edit');
                            expect(links[2].getAttribute('href')).toEqual('#/build/edit/' + builds[i].id);

                        });
                        
                    });
                });
            });
        });
    });

})();