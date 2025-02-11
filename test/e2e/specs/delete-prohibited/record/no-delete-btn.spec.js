var chaisePage = require('../../../utils/chaise.page.js');
var testParams = {
    table_name: "accommodation",
    key: {
        name: "id",
        value: "4004",
        operator: "="
    }
}

describe('View existing record,', function() {

    describe("For table " + testParams.table_name + ",", function() {

        var table, record;

        beforeAll(function() {
            var keys = [];
            keys.push(testParams.key.name + testParams.key.operator + testParams.key.value);
            browser.ignoreSynchronization=true;
            var url = browser.params.url + "/record/#" + browser.params.catalogId + "/product-record:" + testParams.table_name + "/" + keys.join("&");
            browser.get(url);
            table = browser.params.defaultSchema.content.tables[testParams.table_name];
            chaisePage.waitForElement(element(by.id('tblRecord')));
        });

        it("should load chaise-config.js and have deleteRecord=false && resolverImplicitCatalog=4", function() {
            browser.executeScript("return chaiseConfig;").then(function(chaiseConfig) {
                expect(chaiseConfig.deleteRecord).toBeFalsy();
                expect(chaiseConfig.resolverImplicitCatalog).toBe(4);
            });
        });

        it('should not display a delete record button', function() {
            var deleteBtn = chaisePage.recordPage.getDeleteRecordButton();
            expect(deleteBtn.isPresent()).toBeFalsy();
        });

        it('Record Table of Contents panel should be hidden by default as chaiseConfig entry hideTableOfContents is true.', function(done){
            var recPan =  chaisePage.recordPage.getSidePanel(),
            fiddlerBtn = chaisePage.recordPage.getSidePanelFiddler();

            fiddlerBtn.getAttribute("class").then(function(classNameLeft) {
                expect(classNameLeft).toContain("glyphicon glyphicon-triangle-left", "Side Pan Pull button is not pointing in the left direction.");
                expect(recPan.getAttribute("class")).toContain('close-panel', 'Side Panel is not hidden when fiddler is poining in left direction');
                done();
            }).catch( function(err) {
                console.log(err);
                done.fail();
            });
        });

        if (process.env.TRAVIS) {
            it ("Should have the proper permalink in the share popup if resolverImplicitCatalog is the same as catalogId", function (done) {
                var permalink = browser.params.origin+"/id/"+chaisePage.getEntityRow("product-record", testParams.table_name, [{column: "id",value: "4004"}]).RID;

                var shareButton = chaisePage.recordPage.getShareButton(),
                    shareModal = chaisePage.recordPage.getShareModal();

                shareButton.click().then(function () {
                    // wait for dialog to open
                    chaisePage.waitForElement(shareModal);

                    expect(chaisePage.recordPage.getPermalinkText().getText()).toBe(permalink, "permalink url is incorrect");

                    done();
                }).catch(function(err){
                    console.log(err);
                    done.fail();
                });
            });
        }
    });
});
