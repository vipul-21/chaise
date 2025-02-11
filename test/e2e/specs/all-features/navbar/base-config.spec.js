var chaisePage = require('../../../utils/chaise.page.js');

describe('Navbar ', function() {
    var navbar, menu, chaiseConfig, EC = protractor.ExpectedConditions;

    beforeAll(function () {
        browser.ignoreSynchronization=true;
        browser.get(browser.params.url + "/recordset/#" + browser.params.catalogId + "/product-navbar:accommodation");
        navbar = element(by.id('mainnav'));
        menu = element(by.id('navbar-menu'));
        browser.executeScript('return chaiseConfig;').then(function(config) {
            chaiseConfig = config;
            browser.wait(EC.presenceOf(navbar), browser.params.defaultTimeout);
        });
    });

    it('should be visible', function() {
        expect(navbar.isDisplayed()).toBeTruthy();
    });

    it('should display the right title from chaiseConfig', function() {
        var actualTitle = element(by.id('brand-text'));
        var expectedTitle = chaiseConfig.navbarBrandText;
        expect(actualTitle.getText()).toEqual(expectedTitle);
    });

    it('should use the brand image/logo specified in chaiseConfig', function() {
        var actualLogo = element(by.id('brand-image'));
        var expectedLogo = chaiseConfig.navbarBrandImage;
        expect(actualLogo.isDisplayed()).toBeTruthy();
        expect(actualLogo.getAttribute('src')).toMatch(expectedLogo);
    });

    it('for the menu, should generate the correct # of list items', function() {
        var nodesInDOM = menu.all(by.tagName('li'));
        var counter = 7; // counted from chaise config doc rather than having code count

        nodesInDOM.count().then(function(count) {
            expect(count).toEqual(counter, "number of nodes present does not match what's defined in chaise-config");
        });
    });


    it('should open the profile card on click of My Profile link', function(done) {
        var link = element(by.css('.dropdown-toggle'));

        browser.wait(EC.elementToBeClickable(link), browser.params.defaultTimeout);
        chaisePage.clickButton(link).then(function() {
            var profileLink = element(by.id('profile-link'));
            browser.wait(EC.elementToBeClickable(profileLink), browser.params.defaultTimeout);
            chaisePage.clickButton(profileLink).then(function() {
                var modalContent = element(by.css('.modal-content'));

                chaisePage.waitForElement(modalContent);
                expect(modalContent.isDisplayed()).toBeTruthy();
                done();
            }).catch(function (err) {
                done.fail();
                console.log(err);
            });
        });
    });

    it('should close the profile card on click of X on the modal window', function(done) {
         var closeLink = element(by.css('.modal-close'));
         var modalContent = element(by.css('.modal-content'));
         browser.wait(EC.elementToBeClickable(closeLink), browser.params.defaultTimeout);
         chaisePage.clickButton(closeLink).then(function(){

            browser.wait(EC.not(EC.presenceOf(modalContent)), browser.params.defaultTimeout);
            expect(modalContent.isPresent()).toEqual(false);
            done();
        }).catch(function (err) {
            console.log(err);
            done.fail();
        });
    });

    // TODO: These tests are xit'd because we don't handle tests logging in via Globus/other services just yet
    // e.g. On Travis, the user is logged in. On local machines, you must log in manually, which changes the desired order of specs.
    xit('should have a "Log In" link', function() {
        var actualLink = element(by.id('login-link'));
        browser.wait(EC.elementToBeClickable(actualLink), browser.params.defaultTimeout).then(function() {
            expect(actualLink.isDisplayed()).toBeTruthy();
        });
    }).pend("Pending until we handle tests logging in via Globus/other services");

    xit('should have a "Sign Up" link with the right href from chaiseConfig', function(done) {
        var actualLink = element(by.id('signup-link'));
        browser.wait(EC.elementToBeClickable(actualLink), browser.params.defaultTimeout).then(function() {
            expect(actualLink.isDisplayed()).toBeTruthy();
            expect(actualLink.getAttribute('href')).toMatch(chaiseConfig.signUpURL);
            done();
        });
    }).pend("Pending until we handle tests logging in via Globus/other services");

    xit('should display a "Log Out" link', function(done) {
        var logOutLink = element(by.id('logout-link'));
        browser.wait(EC.elementToBeClickable(logOutLink), browser.params.defaultTimeout).then(function() {
            browser.ignoreSynchronization = true;
            expect(logOutLink.isDisplayed()).toBeTruthy();
            done();
        });
    }).pend("Pending until we handle tests logging in via Globus/other services");
});
