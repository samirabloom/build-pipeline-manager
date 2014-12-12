(function ()
{
    'use strict';

    var testConfig = require('../../../build/testConfig.js');
    var mockServerClient = require("mockserver-client").mockServerClient("localhost", testConfig.MOCK_SERVER_PORT);

    describe('create build', function ()
    {
        var ptor = protractor.getInstance();

        beforeEach(function ()
        {
            //when
            ptor.get('#/build/create');
        });

        it('should toggle operator id when NYX_OGS is selected/unselected', function(){
            expect(element(by.css('#gameOperatorIdBlock')).isPresent()).toBe(false);

            element(by.css('#buildProvider option:nth-child(4)')).click();

            expect(element(by.css('#gameOperatorIdBlock'))).toBeDefined();
        });

        /*it('should display build create form and redirect to the build page on success', function () {

            //given
            mockServerClient.mockAnyResponse({
                'httpRequest' : {
                    'path' : '/buildManager/build',
                    'method' : 'PUT',
                    'body' : {

                    }
                },
                'httpResponse' : {
                    'statusCode' : 204
                }
            });

            //then
            expect(element.all(by.css('h1')).first().getText()).toMatch("Create build");

            element(by.id('name')).sendKeys('ACCOUNT-SYSTEM-NAME');

            element(by.id('lobbyUrl')).sendKeys('http://a.domain.name/url');
            element(by.id('depositUrl')).sendKeys('http://a.domain.name/url');
            element(by.id('demoPlayDepositUrl')).sendKeys('http://a.domain.name/url');
            element(by.id('loginUrl')).sendKeys('http://a.domain.name/url'); 

            element(by.css('#demoPlayCurrency option:nth-child(1)')).click();
            element(by.id('demoPlayStartingBalance')).sendKeys('500');

            element(by.id('googleAnalyticsId')).sendKeys('GOOGLE-ANALITICS-ID');

            element(by.css('#buildProvider option:nth-child(1)')).click();

            element.all(by.id('submitCreateForm')).click();

            expect(browser.getCurrentUrl()).toContain('#/build/list');

        });*/

        /*it('should display build create form and submit it', function ()
        {
            //when
            ptor.get('#/build/create');

            //then
            expect(element.all(by.css('h1')).first().getText()).toMatch("Create build");

            element(by.id('name')).sendKeys('ACCOUNT-SYSTEM-NAME');

            element(by.id('lobbyUrl')).sendKeys('http://a.domain.name/url');
            element(by.id('depositUrl')).sendKeys('http://a.domain.name/url');
            element(by.id('demoPlayDepositUrl')).sendKeys('http://a.domain.name/url');
            element(by.id('loginUrl')).sendKeys('http://a.domain.name/url');            
            
            element(by.css('#demoPlayCurrency option:nth-child(1)')).click();
            element(by.id('demoPlayStartingBalance')).sendKeys('500');

            element(by.id('googleAnalyticsId')).sendKeys('GOOGLE-ANALITICS-ID');

            element(by.css('#buildProvider option:nth-child(1)')).click();

            element.all(by.id('submitCreateForm')).click();

            expect(browser.getCurrentUrl()).toContain('#/build/list');
        });*/
        

    });

})();