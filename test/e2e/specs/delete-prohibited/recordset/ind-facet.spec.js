var chaisePage = require('../../../utils/chaise.page.js');
var recordEditHelpers = require('../../../utils/recordedit-helpers.js');
var recordSetHelpers = require('../../../utils/recordset-helpers.js');

var EC = protractor.ExpectedConditions;
var testParams = {
    schema_name: "faceting",
    table_name: "main",
    sort: "@sort(id)",
    totalNumFacets: 21,
    facetNames: [ "id", "int_col", "float_col", "date_col", "timestamp_col", "text_col",
                  "longtext_col", "markdown_col", "boolean_col", "jsonb_col", "F1",
                  "to_name", "f3 (term)", "from_name", "F1 with Term", "Check Presence Text",
                  "F3 Entity", "F5",
                  "col_w_column_order_false", "col_w_column_order", "col_w_long_values"],
    defaults: {
        openFacetNames: [ "id", "int_col", "to_name" ],
        numFilters: 2,
        numRows: 1,
        pageSize: 25
    },
    searchBox: {
        term: "one",
        filter: "Search: one",
        numRows: 6,
        term2: "eve",
        term2Rows: 4,
        term3: "ns",
        term3Filter: "Search: evens",
        term3Rows: 1
    },
    minInputClass: "range-min",
    minInputClearClass: "min-clear",
    maxInputClass: "range-max",
    maxInputClearClass: "max-clear",
    tsMinDateInputClass: "ts-date-range-min",
    tsMinDateInputClearClass: "min-date-clear",
    tsMinTimeInputClass: "ts-time-range-min",
    tsMinTimeInputClearClass: "min-time-clear",
    tsMaxDateInputClass: "ts-date-range-max",
    tsMaxDateInputClearClass: "max-date-clear",
    tsMaxTimeInputClass: "ts-time-range-max",
    tsMaxTimeInputClearClass: "max-time-clear",
    facets: [
        {
            name: "id",
            type: "choice",
            totalNumOptions: 10,
            option: 2,
            filter: "id: 3",
            numRows: 1,
            options: [ '1', '2', '3', '4', '5', '6', '7', '8', '9', '10' ],
            comment: "ID comment"
        },
        {
            name: "int_col",
            type: "numeric",
            notNullNumRows: 20,
            listElems: 1,
            invalid: 1.1,
            error: "Please enter an integer value.",
            range: {
                min: 5,
                max: 10,
                filter: "int_col: 5 to 10",
                numRows: 6
            },
            justMin: {
                min: 6,
                filter: "int_col: ≥ 6",
                numRows: 17
            },
            justMax: {
                max: 12,
                filter: "int_col: ≤ 12",
                numRows: 15
            },
            comment: "int comment"
        },
        {
            name: "float_col",
            type: "numeric",
            listElems: 0,
            invalid: "1.1.",
            error: "Please enter a decimal value.",
            range: {
                min: 6.5,
                max: 12.2,
                filter: "float_col: 6.5000 to 12.2000",
                numRows: 12
            },
            justMin: {
                min: 8.9,
                filter: "float_col: ≥ 8.9000",
                numRows: 14
            },
            justMax: {
                max: 7.45,
                filter: "float_col: ≤ 7.4500",
                numRows: 4
            }
        },
        {
            name: "date_col",
            type: "date",
            listElems: 0,
            invalid: "2006-14-22",
            error: "Please enter a date value in YYYY-MM-DD format.",
            range: {
                min: "2002-06-14",
                max: "2007-12-12",
                filter: "date_col: 2002-06-14 to 2007-12-12",
                numRows: 5
            },
            justMin: {
                min: "2009-12-14",
                filter: "date_col: ≥ 2009-12-14",
                numRows: 3
            },
            justMax: {
                max: "2007-04-18",
                filter: "date_col: ≤ 2007-04-18",
                numRows: 14
            }
        },
        {
            name: "timestamp_col",
            type: "timestamp",
            listElems: 0,
            notNullNumRows: 20,
            invalid: {
                date: "2001-14-04",
                dateError: "Please enter a date value in YYYY-MM-DD format.",
                time: "25:64:12",
                timeError: "Please enter a time value in 24-hr HH:mm:ss format."
            },
            range: {
                minDate: "2004-05-20",
                minTime: "10:08:00",
                maxDate: "2007-12-06",
                maxTime: "17:26:12",
                filter: "timestamp_col: 2004-05-20 10:08:00 to 2007-12-06 17:26:12",
                numRows: 3
            },
            justMin: {
                date: "2004-05-20",
                time: "10:08:00",
                filter: "timestamp_col: ≥ 2004-05-20 10:08:00",
                numRows: 8
            },
            justMax: {
                date: "2007-12-06",
                time: "17:26:12",
                filter: "timestamp_col: ≤ 2007-12-06 17:26:12",
                numRows: 15
            },
            comment: "timestamp column"
        },
        {
            name: "text_col",
            type: "choice",
            totalNumOptions: 12,
            option: 1,
            filter: "text_col: No Value",
            numRows: 5,
            options: [ 'All Records With Value', 'No Value', 'one', 'Empty', 'two', 'seven', 'eight', 'elevens', 'four', 'six', 'ten', 'three' ]
        },
        {
            name: "longtext_col",
            type: "choice",
            totalNumOptions: 10,
            option: 2,
            filter: "longtext_col: two",
            numRows: 5,
            options: [ 'Empty', 'one', 'two', 'eight', 'eleven', 'five', 'four', 'nine', 'seven', 'six' ],
            comment: "A lengthy comment for the facet of the longtext_col. This should be displyed properly in the facet."
        },
        {
            name: "markdown_col",
            type: "choice",
            totalNumOptions: 10,
            option: 3,
            filter: "markdown_col: eight",
            numRows: 1,
            options: [ 'Empty', 'one', 'two', 'eight', 'eleven', 'five', 'four', 'nine', 'seven' , 'six']
        },
        {
            name: "boolean_col",
            type: "choice",
            totalNumOptions: 3,
            option: 2,
            filter: "boolean_col: Yes",
            numRows: 10,
            options: [ 'All Records With Value', 'No', 'Yes' ]
        },
        {
            name: "jsonb_col",
            type: "choice",
            totalNumOptions: 11,
            option: 4,
            filter: 'jsonb_col: { "key": "four" }',
            numRows: 1,
            options: [ 'All Records With Value', '{"key":"one"}', '{"key":"two"}', '{"key":"three"}', '{"key":"four"}', '{"key":"five"}', '{"key":"six"}', '{"key":"seven"}', '{"key":"eight"}', '{"key":"nine"}', '{"key":"ten"}' ]
        },
        {
            name: "F1",
            type: "choice",
            totalNumOptions: 11,
            option: 2,
            filter: "F1 : two",
            numRows: 10,
            options: [ 'No Value', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten' ]
        },
        {
            name: "to_name",
            type: "choice",
            totalNumOptions: 10,
            option: 0,
            filter: "to_name: one",
            numRows: 10,
            options: [ 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten' ],
            comment: "open facet"
        },
        {
            name: "f3 (term)",
            type: "choice",
            totalNumOptions: 3,
            option: 1,
            filter: "f3 (term): one",
            numRows: 6,
            options: [ 'All Records With Value', 'one', 'two' ]
        },
        {
            name: "from_name",
            type: "choice",
            totalNumOptions: 11,
            option: 5,
            filter: "from_name: 5",
            numRows: 1,
            options: [ 'All Records With Value', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        {
            name: "F1 with Term",
            type: "choice",
            totalNumOptions: 11,
            option: 2,
            filter: "F1 with Term : two",
            numRows: 10,
            options: [ 'All Records With Value', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten' ],
            comment: "F1 with Term comment"
        },
        {
            name: "Check Presence Text",
            type: "check_presence",
            notNullNumRows: 9,
            notNullFilter: "Check Presence Text : All Records With Value",
            nullNumRows: 21,
            nullFilter: "Check Presence Text : No Value"
        },
        {
            name: "F3 Entity",
            type: "choice",
            totalNumOptions: 4,
            option: 1,
            filter: "F3 Entity : No Value",
            numRows: 23,
            options: [ 'All Records With Value', 'No Value', 'one', 'two']
        },
        {
            name: "F5",
            type: "choice",
            totalNumOptions: 4,
            option: 2,
            filter: "F5 : one",
            numRows: 1,
            options: ["All Records With Value", "No Value", "one", "two"]

        },
        {
            name: "col_w_column_order_false",
            type: "choice",
            totalNumOptions: 8,
            option: 1,
            filter: "col_w_column_order_false: 01",
            numRows: 9,
            options: [ 'All Records With Value', '01', '02', '03', '04', '05', '06', '07']
        }
    ],
    multipleFacets: [
        { facetIdx: 10, option: 2, numOptions: 11, numRows: 10 },
        { facetIdx: 11, option: 0, numOptions: 2, numRows: 5 },
        { facetIdx: 12, option: 1, numOptions: 2, numRows: 5 },
        { facetIdx: 13, option: 2, numOptions: 6, numRows: 1 }
    ]
};

describe("Viewing Recordset with Faceting,", function() {

    describe("For table " + testParams.table_name + ",", function() {

        var table, record,
        uri = browser.params.url + "/recordset/#" + browser.params.catalogId + "/" + testParams.schema_name + ":" + testParams.table_name + testParams.sort;

        beforeAll(function () {
            browser.ignoreSynchronization=true;
            browser.get(uri);
            chaisePage.waitForElementInverse(element(by.id("spinner")));
        });

        describe("default presentation based on facets annotation ", function () {
            it("should have " + testParams.totalNumFacets + " facets", function () {
                browser.wait(function() {
                    return chaisePage.recordsetPage.getAllFacets().count().then(function(ct) {
                        return (ct==testParams.totalNumFacets);
                    });
                }, browser.params.defaultTimeout);

                expect(chaisePage.recordsetPage.getFacetTitles()).toEqual(testParams.facetNames, "All facets' names is incorrect");
            });

            it("should have 3 facets open", function () {
                chaisePage.recordsetPage.getOpenFacets().count().then(function (ct) {
                    expect(ct).toBe(testParams.defaults.openFacetNames.length, "Number of open facets is incorrect");

                    return chaisePage.recordsetPage.getOpenFacetTitles();
                }).then(function (text) {
                    expect(text).toEqual(testParams.defaults.openFacetNames, "Names of open facets are incorrect");
                });
            });

            // test defaults and values shown
            it("'id' facet should have 1 row checked", function () {
                // use 0 index
                chaisePage.recordsetPage.getCheckedFacetOptions(0).count().then(function (ct) {
                    expect(ct).toBe(1);
                });
            });

            it("'int_col' facet should not show the histogram", function () {
                // use 1 index
                browser.wait(EC.not(EC.visibilityOf(chaisePage.recordsetPage.getHistogram(1)))).then(function () {
                    expect(true).toBeTruthy("The histogram is displayed");
                });
            });

            it("should have 2 filters selected", function () {
                chaisePage.recordsetPage.getFacetFilters().count().then(function (ct) {
                    expect(ct).toBe(testParams.defaults.numFilters, "Number of visible filters is incorrect");
                });
            });

            it("should have 1 row visible", function () {
                chaisePage.recordsetPage.getRows().count().then(function (ct) {
                    expect(ct).toBe(testParams.defaults.numRows, "Number of visible rows is incorrect");
                });
            });

            it("should have 1 row selected in show more popup for scalar picker.", function () {
                var showMore = chaisePage.recordsetPage.getShowMore(0);

                // open show more, verify only 1 row checked, check another and submit
                showMore.click().then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedModalOptions().count().then(function(ct) {
                            return ct == 1;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getModalOptions();
                }).then(function (options) {
                    // click the 2nd option
                    return chaisePage.clickButton(options[1]);
                }).then(function () {
                    return chaisePage.recordsetPage.getModalSubmit().click();
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedFacetOptions(0).count().then(function(ct) {
                            return ct == 2;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getCheckedFacetOptions(0).count();
                }).then(function (ct) {
                    expect(ct).toBe(2, "Number of facet options is incorrect after returning from modal");

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function (ct) {
                    expect(ct).toBe(2, "Number of visible rows after selecting a second option from the modal is incorrect");

                    // search string too
                    chaisePage.recordsetPage.getFacetSearchBox(0).sendKeys(11);

                    browser.wait(function () {
                        return chaisePage.recordsetPage.getFacetOptions(0).count().then(function(ct) {
                            return ct == 3;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getFacetOptions(0).count();
                }).then(function (ct) {
                    expect(ct).toBe(3, "Facet values after search are incorrect");

                    return chaisePage.recordsetPage.getFacetSearchBoxClear(0).click();
                });
            });

            it("boolean facet should not have a search box present", function () {
                // idx 8 is for boolean facet
                var booleanFacet = chaisePage.recordsetPage.getFacetById(8);

                booleanFacet.click().then(function () {
                    return chaisePage.recordsetPage.getFacetSearchBox(8).isDisplayed();
                }).then(function (bool) {
                    expect(bool).toBeFalsy();

                    return booleanFacet.click();
                });
            });

            it("search using the global search box should search automatically, show the search phrase as a filter, and show the set of results", function () {
                var mainSearch = chaisePage.recordsetPage.getSearchBox();

                chaisePage.recordsetPage.getClearAllFilters().click().then(function () {
                    return chaisePage.waitForElementInverse(element(by.id("spinner")));
                }).then(function () {
                    mainSearch.sendKeys(testParams.searchBox.term);

                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.searchBox.numRows;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getFacetFilters();
                }).then(function (filters) {
                    return filters[0].getText();
                }).then(function (text) {
                    expect(text).toBe(testParams.searchBox.filter, "Filter for global search input is incorrect");

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function (ct) {
                    expect(ct).toBe(testParams.searchBox.numRows, "Number of rows for search input is incorrect");

                    return chaisePage.recordsetPage.getSearchClearButton().click();
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.defaults.pageSize;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function (ct) {
                    expect(ct).toBe(testParams.defaults.pageSize, "Number of rows after clearing search input via search clear button");

                    return mainSearch.getText();
                }).then(function (text) {
                    expect(text).toBe("", "Main search did not clear properly after clicking the remove search button in the search input");

                    mainSearch.sendKeys(testParams.searchBox.term);

                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.searchBox.numRows;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getFacetFilters();
                }).then(function (filters) {
                    return filters[0].element(by.css(".remove-link")).click();
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.defaults.pageSize;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function (ct) {
                    expect(ct).toBe(testParams.defaults.pageSize, "Number of rows after clearing search input via search clear button");

                    return mainSearch.getText();
                }).then(function (text) {
                    expect(text).toBe("", "Main search did not clear properly after clicking the 'x' in the filter");

                    mainSearch.sendKeys(testParams.searchBox.term2);
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.searchBox.term2Rows;
                        });
                    }, browser.params.defaultTimeout);

                    mainSearch.sendKeys(testParams.searchBox.term3);
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.searchBox.term3Rows;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getFacetFilters();
                }).then(function (filters) {
                    return filters[0].getText();
                }).then(function (text) {
                    expect(text).toBe(testParams.searchBox.term3Filter, "adding another character to an existing search did not update the filter properly");
                });
            });

            it("should show 25 rows and 0 filters after clicking 'clear all'", function () {
                chaisePage.recordsetPage.getClearAllFilters().click().then(function () {
                    chaisePage.recordsetPage.waitForInverseMainSpinner();
                    //verify there's no facet string in url
                    return browser.getCurrentUrl();
                }).then(function (url) {
                    expect(url).toBe(uri, "uri after clear all is incorrect");

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function (ct) {
                    expect(ct).toBe(testParams.defaults.pageSize, "Number of visible rows is incorrect");

                    return chaisePage.recordsetPage.getFacetFilters().count();
                }).then(function (ct) {
                    expect(ct).toBe(0, "Number of visible filters is incorrect");
                });
            });

            it("should have 1 row selected in show more popup for entity.", function (done) {
                var showMore = chaisePage.recordsetPage.getShowMore(11);

                chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(11, 0)).then(function () {
                    // open show more, verify only 1 row checked, check another and submit
                    return showMore.click()
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedModalOptions().count().then(function(ct) {
                            return ct == 1;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getModalOptions();
                }).then(function (options) {
                    // click the 2nd option
                    return chaisePage.clickButton(options[1]);
                }).then(function () {
                    return chaisePage.recordsetPage.getModalSubmit().click();
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedFacetOptions(11).count().then(function(ct) {
                            return ct == 2;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getCheckedFacetOptions(11).count();
                }).then(function (ct) {
                    expect(ct).toBe(2, "Number of facet options is incorrect after returning from modal");

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function (ct) {
                    expect(ct).toBe(15, "Number of visible rows after selecting a second option from the modal is incorrect");

                    return chaisePage.clickButton(chaisePage.recordsetPage.getClearAllFilters());
                }).then(function () {
                    done();
                }).catch(function (err) {
                    done.fail(err);
                });
            });

            it("should show correct tooltip for the facets.", function () {
                testParams.facets.forEach(function (facetParams, idx) {
                    var facetHeader = chaisePage.recordsetPage.getFacetHeaderById(idx);
                    var tooltip = chaisePage.getTooltipDiv();

                    // move mouse over the facet header to show the tooltip
                    browser.actions().mouseMove(facetHeader).perform();
                    if (facetParams.comment) {
                        chaisePage.waitForElement(tooltip).then(function () {
                            expect(tooltip.getText()).toBe(facetParams.comment, "comment missmatch for facet index=" + idx);
                        }).catch(function (err) {
                            console.log("error while waiting for tooltip")
                            console.log(err);
                        });
                    }

                    // move mouse to somewhere that doesn't have tooltip just to clear the tooltip from page
                    browser.actions().mouseMove(chaisePage.recordsetPage.getTotalCount()).perform();
                    chaisePage.waitForElementInverse(tooltip);
                });
            });

            // facets 12 (idx = 11), 2, and 1 are open by default when the page loads
            //   - 1 and 2 have values preselected in them
            //   - 12 has open:true in the visible-columns annotaiton under the filter context
            afterAll(function closeDefaultOpenFacets() {
                // close the facets in opposite order so they dont move when trying to click others
                chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(11)).then(function() {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                            return ct == testParams.totalNumFacets-2;
                        });
                    }, browser.params.defaultTimeout)

                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(1));
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                            return ct == testParams.totalNumFacets-1;
                        });
                    }, browser.params.defaultTimeout)

                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(0));
                });
            });
        });

        describe("selecting individual filters for each facet type", function () {

            var clearAll;

            beforeAll(function () {
                clearAll = chaisePage.recordsetPage.getClearAllFilters();
            });

            for (var j=0; j<testParams.facets.length; j++) {
                // anon function to capture looping variable
                (function(facetParams, idx) {
                    if (facetParams.type == "choice") {
                        // tests for choice facets
                        describe("for choice facet: " + facetParams.name + ",", function () {
                            it("should open the facet, select a value to filter on, and update the search criteria.", function () {
                                browser.wait(function () {
                                    return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                                        return ct == testParams.totalNumFacets;
                                    });
                                }, browser.params.defaultTimeout).then(function () {
                                    // open facet
                                    return chaisePage.recordsetPage.getFacetById(idx).click();
                                }).then(function() {
                                    // wait for facet to open
                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getFacetCollapse(idx)), browser.params.defaultTimeout);

                                    // wait for facet checkboxes to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getFacetOptions(idx).count().then(function(ct) {
                                            return ct == facetParams.totalNumOptions;
                                        });
                                    }, browser.params.defaultTimeout);

                                    // wait for list to be fully visible
                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getList(idx)), browser.params.defaultTimeout);

                                    // special case for 'jsonb'
                                    return (facetParams.name == "jsonb_col" ? chaisePage.recordsetPage.getJsonbFacetOptionsText(idx) : chaisePage.recordsetPage.getFacetOptionsText(idx));
                                }).then(function (text) {
                                    expect(text).toEqual(facetParams.options, "facet options are incorrect for '" + facetParams.name + "' facet");

                                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(idx, facetParams.option));
                                }).then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getFacetFilters().count();
                                }).then(function (ct) {
                                    expect(ct).toBe(1, "number of filters is incorrect for '" + facetParams.name + "' facet");

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.filter, "filter name is incorrect for '" + facetParams.name + "' facet");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);
                                    // close the facet
                                    return chaisePage.recordsetPage.getFacetById(idx).click();
                                }).catch(function (exc) {
                                    console.dir(exc);
                                });
                            });
                        });
                    } else if (facetParams.type == "numeric" || facetParams.type == "date" ) {
                        describe("for range facet: " + facetParams.name + ",", function () {
                            var minInput, maxInput, minClear, maxClear;

                            beforeAll(function () {
                                // inputs
                                minInput = chaisePage.recordsetPage.getRangeMinInput(idx, testParams.minInputClass);
                                maxInput = chaisePage.recordsetPage.getRangeMaxInput(idx, testParams.maxInputClass);
                                // clear buttons
                                minClear = chaisePage.recordsetPage.getInputClear(idx, testParams.minInputClearClass);
                                maxClear = chaisePage.recordsetPage.getInputClear(idx, testParams.maxInputClearClass);
                            });

                            it("should open the facet, test validators, filter on a range, and update the search criteria.", function (done) {
                                // open facet
                                browser.wait(function () {
                                    return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                                        return ct == testParams.totalNumFacets;
                                    });
                                }, browser.params.defaultTimeout).then(function () {
                                    return chaisePage.recordsetPage.getFacetById(idx).click();
                                }).then(function(facet) {
                                    // wait for facet to open
                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getFacetCollapse(idx)), browser.params.defaultTimeout);
                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getRangeSubmit(idx)), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getFacetOptions(idx).count();
                                }).then(function (ct) {
                                    expect(ct).toBe(facetParams.listElems + 1, "There are more list elements for '" + facetParams.name + "' facet than expected");

                                    // test validators
                                    minInput.sendKeys(facetParams.invalid);

                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getValidationError(idx)), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getValidationError(idx).getText();
                                }).then(function (text) {
                                    expect(text).toBe(facetParams.error, "Validation error for '" + facetParams.name + "' did not show up or the message is incorrect");

                                    return minClear.click();
                                }).then(function () {

                                    // test min and max being set
                                    // define test params values
                                    minInput.sendKeys(facetParams.range.min);
                                    maxInput.sendKeys(facetParams.range.max);

                                    // let validation message disappear
                                    browser.sleep(10);

                                    return chaisePage.recordsetPage.getRangeSubmit(idx).click();
                                }).then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getFacetFilters().count();
                                }).then(function (ct) {
                                    expect(ct).toBe(1, "number of filters is incorrect for '" + facetParams.name + "' facet");

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.range.filter, "filter name is incorrect for '" + facetParams.name + "' facet");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.range.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.range.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);

                                    return minClear.click();
                                }).then(function () {
                                    return maxClear.click();
                                }).then(function () {
                                    done();
                                }).catch(chaisePage.catchTestError(done));
                            });

                            if (facetParams.notNullNumRows) {
                                it ("should be able to filter not-null values.", function (done) {
                                    var notNulloption = chaisePage.recordsetPage.getFacetOption(idx, 0);
                                    chaisePage.clickButton(notNulloption).then(function () {
                                        // wait for table rows to load
                                        browser.wait(function () {
                                            return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                                return ct == facetParams.notNullNumRows;
                                            });
                                        }, browser.params.defaultTimeout);

                                        return chaisePage.recordsetPage.getRows().count();
                                    }).then(function(ct) {
                                        expect(ct).toBe(facetParams.notNullNumRows, "number of rows (for not-null) is incorrect for '" + facetParams.name + "' facet");
                                        expect(chaisePage.recordsetPage.getRangeFacetForm(idx).getAttribute('disabled')).toEqual('true', "form enabled after selecting not-null for '" + facetParams.name + "' facet");

                                        return clearAll.click();
                                    }).then(function () {
                                        browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);
                                        done();
                                    }).catch(chaisePage.catchTestError(done));
                                });
                            }

                            it("should filter on just a min value and update the search criteria.", function (done) {
                                var minInput = chaisePage.recordsetPage.getRangeMinInput(idx, testParams.minInputClass),
                                minClear = chaisePage.recordsetPage.getInputClear(idx, testParams.minInputClearClass);

                                // test just min being set
                                minInput.sendKeys(facetParams.justMin.min);

                                // let validation message disappear
                                browser.sleep(20);

                                chaisePage.recordsetPage.getRangeSubmit(idx).click().then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.justMin.filter, "filter name is incorrect for '" + facetParams.name + "' facet with just min value");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.justMin.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.justMin.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet with just min value");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);

                                    return minClear.click();
                                }).then(function () {
                                    done();
                                }).catch(chaisePage.catchTestError(done));
                            });

                            it("should filter on just a max value and update the search criteria.", function (done) {
                                var maxInput = chaisePage.recordsetPage.getRangeMaxInput(idx, testParams.maxInputClass),
                                maxClear = chaisePage.recordsetPage.getInputClear(idx, testParams.maxInputClearClass);

                                // test just max being set
                                maxInput.sendKeys(facetParams.justMax.max);

                                // let validation message disappear
                                browser.sleep(20);

                                chaisePage.recordsetPage.getRangeSubmit(idx).click().then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.justMax.filter, "filter name is incorrect for '" + facetParams.name + "' facet with just min value");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.justMax.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.justMax.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet with just min value");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);
                                    done();
                                }).catch(chaisePage.catchTestError(done));
                            });

                            it ("should close the facet.", function (done) {
                                chaisePage.recordsetPage.getFacetById(idx).click().then(function () {
                                    done();
                                }).catch(chaisePage.catchTestError(done));
                            })
                        });

                    } else if (facetParams.type == "timestamp") {
                        describe("for range facet: " + facetParams.name + ",", function () {
                            var minDateInput, minTimeInput, maxDateInput, maxTimeInput,
                                minDateClear, minTimeClear, maxDateClear, maxTimeClear;

                            beforeAll(function () {
                                // inputs
                                minDateInput = chaisePage.recordsetPage.getRangeMinInput(idx, testParams.tsMinDateInputClass);
                                minTimeInput = chaisePage.recordsetPage.getRangeMinInput(idx, testParams.tsMinTimeInputClass);
                                maxDateInput = chaisePage.recordsetPage.getRangeMaxInput(idx, testParams.tsMaxDateInputClass);
                                maxTimeInput = chaisePage.recordsetPage.getRangeMaxInput(idx, testParams.tsMaxTimeInputClass);
                                // clear buttons
                                minDateClear = chaisePage.recordsetPage.getInputClear(idx, testParams.tsMinDateInputClearClass);
                                minTimeClear = chaisePage.recordsetPage.getInputClear(idx, testParams.tsMinTimeInputClearClass);
                                maxDateClear = chaisePage.recordsetPage.getInputClear(idx, testParams.tsMaxDateInputClearClass);
                                maxTimeClear = chaisePage.recordsetPage.getInputClear(idx, testParams.tsMaxTimeInputClearClass);
                            });

                            it("should open the facet, test validators, filter on a range, and update the search criteria.", function () {
                                browser.wait(function () {
                                    return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                                        return ct == testParams.totalNumFacets;
                                    });
                                }, browser.params.defaultTimeout).then(function () {
                                    // open facet
                                    return chaisePage.recordsetPage.getFacetById(idx).click();
                                }).then(function(facet) {
                                    // wait for facet to open
                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getFacetCollapse(idx)), browser.params.defaultTimeout);
                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getRangeSubmit(idx)), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getFacetOptions(idx).count();
                                }).then(function (ct) {
                                    expect(ct).toBe(facetParams.listElems + 1, "There are more list elements for '" + facetParams.name + "' facet than expected");

                                    // test validators
                                    minDateInput.sendKeys(facetParams.invalid.date);
                                    browser.wait(function () {
                                        return minDateInput.getAttribute("value").then(function (text) {
                                            return text == facetParams.invalid.date;
                                        });
                                    }, browser.params.defaultTimeout);

                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getValidationError(idx)), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getValidationError(idx).getText();
                                }).then(function (text) {
                                    expect(text).toBe(facetParams.invalid.dateError, "The date validation message did not show up or is incorrect");

                                    return minDateClear.click();
                                }).then(function () {
                                    minTimeInput.sendKeys(facetParams.invalid.time);

                                    browser.wait(function () {
                                        return minTimeInput.getAttribute("value").then(function (text) {
                                            return text == facetParams.invalid.time;
                                        });
                                    }, browser.params.defaultTimeout);

                                    browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getValidationError(idx)), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getValidationError(idx).getText();
                                }).then(function (text) {
                                    expect(text).toBe(facetParams.invalid.timeError, "The time validation message did not show up or is incorrect");

                                    return minTimeClear.click();
                                }).then(function() {
                                    // test min and max being set
                                    // define test params values
                                    minDateInput.sendKeys(facetParams.range.minDate);
                                    minTimeInput.sendKeys(facetParams.range.minTime);
                                    maxDateInput.sendKeys(facetParams.range.maxDate);
                                    maxTimeInput.sendKeys(facetParams.range.maxTime);

                                    // let validation message disappear
                                    browser.sleep(20);

                                    // get submit button
                                    return chaisePage.recordsetPage.getRangeSubmit(idx).click();
                                }).then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getFacetFilters().count();
                                }).then(function (ct) {
                                    expect(ct).toBe(1, "number of filters is incorrect for '" + facetParams.name + "' facet");

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.range.filter, "filter name is incorrect for '" + facetParams.name + "' facet");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.range.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.range.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);

                                    //clear the inputs
                                    return minDateClear.click();
                                }).then(function () {
                                    return minTimeClear.click();
                                }).then(function () {
                                    return maxDateClear.click();
                                }).then(function () {
                                    return maxTimeClear.click();
                                })
                            });

                            if (facetParams.notNullNumRows) {
                                it ("should be able to filter not-null values.", function (done) {
                                    var notNulloption = chaisePage.recordsetPage.getFacetOption(idx, 0);
                                    chaisePage.clickButton(notNulloption).then(function () {
                                        // wait for table rows to load
                                        browser.wait(function () {
                                            return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                                return ct == facetParams.notNullNumRows;
                                            });
                                        }, browser.params.defaultTimeout);

                                        return chaisePage.recordsetPage.getRows().count();
                                    }).then(function(ct) {
                                        expect(ct).toBe(facetParams.notNullNumRows, "number of rows (for not-null) is incorrect for '" + facetParams.name + "' facet");
                                        expect(chaisePage.recordsetPage.getRangeFacetForm(idx).getAttribute('disabled')).toEqual('true', "form enabled after selecting not-null for '" + facetParams.name + "' facet");

                                        return clearAll.click();
                                    }).then(function () {
                                        browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);
                                        done();
                                    }).catch(chaisePage.catchTestError(done));
                                });
                            }

                            it("should filter on just a min value and update the search criteria.", function () {
                                // test just min being set
                                minDateInput.sendKeys(facetParams.justMin.date);
                                minTimeInput.sendKeys(facetParams.justMin.time);

                                //let validation dissappear
                                browser.sleep(20);

                                // get submit button
                                chaisePage.recordsetPage.getRangeSubmit(idx).click().then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.justMin.filter, "filter name is inccorect for '" + facetParams.name + "' facet");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.justMin.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.justMin.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);

                                    //clear the min inputs
                                    return minDateClear.click();
                                }).then(function () {
                                    return minTimeClear.click();
                                });
                            });

                            it("should filter on just a max value and update the search criteria.", function () {
                                // test just max being set
                                maxDateInput.sendKeys(facetParams.justMax.date);
                                maxTimeInput.sendKeys(facetParams.justMax.time);

                                //let validation dissappear
                                browser.sleep(20);

                                // get submit button
                                chaisePage.recordsetPage.getRangeSubmit(idx).click().then(function () {
                                    // wait for request to return
                                    browser.wait(EC.visibilityOf(clearAll), browser.params.defaultTimeout);

                                    //should only be one
                                    return chaisePage.recordsetPage.getFacetFilters();
                                }).then(function (filters) {
                                    return filters[0].getText();
                                }).then(function(text) {
                                    expect(text).toBe(facetParams.justMax.filter, "filter name is inccorect for '" + facetParams.name + "' facet");

                                    // wait for table rows to load
                                    browser.wait(function () {
                                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                            return ct == facetParams.justMax.numRows;
                                        });
                                    }, browser.params.defaultTimeout);

                                    return chaisePage.recordsetPage.getRows().count();
                                }).then(function(ct) {
                                    expect(ct).toBe(facetParams.justMax.numRows, "number of rows is incorrect for '" + facetParams.name + "' facet");

                                    return clearAll.click();
                                }).then(function () {
                                    browser.wait(EC.not(EC.visibilityOf(clearAll)), browser.params.defaultTimeout);

                                    // close the facet
                                    return chaisePage.recordsetPage.getFacetById(idx).click();
                                }).catch(function (exc) {
                                    console.dir(exc);
                                });
                            });
                        });
                    } else if (facetParams.type == "check_presence") {
                        describe("for check_presence facet: " + facetParams.name + ",", function () {
                            it("should open the facet and the two options should be available.", function (done) {
                                browser.wait(function () {
                                    return chaisePage.recordsetPage.getClosedFacets().count().then(function (ct) {
                                        return ct == testParams.totalNumFacets;
                                    });
                                }, browser.params.defaultTimeout);

                                recordSetHelpers.openFacetAndTestFilterOptions(
                                    testParams.name, idx, ['All Records With Value', 'No Value'], done
                                );
                            });

                            it("selecting the not-null option, should only show the applicable rows.", function (done) {
                                recordSetHelpers.testSelectFacetOption(idx, 0, facetParams.name, facetParams.notNullFilter, facetParams.notNullNumRows, done);
                            });

                            it("selecting the null option, should only show the applicable rows.", function (done) {
                                recordSetHelpers.testSelectFacetOption(idx, 1, facetParams.name, facetParams.nullFilter, facetParams.nullNumRows, done);
                            });

                            it ("should close the facet.", function (done) {
                                chaisePage.recordsetPage.getFacetById(idx).click().then(function () {
                                    done();
                                }).catch(function (err) {
                                    done.fail(err);
                                });
                            });
                        });
                    }
                })(testParams.facets[j], j);
            }
        });

        // tests selecting an option for a facet, verifying the filters shown and rows displayed, then moving to the next one while preserving the previous selection
        describe("selecting facet options and verifying row after each selection", function () {

            beforeEach(function() {
                browser.wait(function () {
                    return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                        return ct == testParams.totalNumFacets;
                    });
                }, browser.params.defaultTimeout);
            });

            for (var i=0; i<testParams.multipleFacets.length; i++) {
                // anon function to capture looping variable
                (function(facetParams, idx) {
                    it("for facet at index: " + facetParams.facetIdx + ", it should open the facet, select a value to filter on, and update the search criteria.", function () {
                        chaisePage.recordsetPage.getFacetById(facetParams.facetIdx).click().then(function () {
                            // wait for facet to open
                            browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getFacetCollapse(facetParams.facetIdx)), browser.params.defaultTimeout);

                            // wait for facet checkboxes to load
                            browser.wait(function () {
                                return chaisePage.recordsetPage.getFacetOptions(facetParams.facetIdx).count().then(function(ct) {
                                    return ct == facetParams.numOptions;
                                });
                            }, browser.params.defaultTimeout);

                            // wait for list to be fully visible
                            browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getList(facetParams.facetIdx)), browser.params.defaultTimeout);

                            return chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(facetParams.facetIdx, facetParams.option));
                        }).then(function () {
                            // wait for request to return
                            browser.wait(EC.visibilityOf(chaisePage.recordsetPage.getClearAllFilters()), browser.params.defaultTimeout);

                            return chaisePage.recordsetPage.getFacetFilters().count();
                        }).then(function (ct) {
                            expect(ct).toBe(idx+1, "number of filters is incorrect for facet at index: " + facetParams.facetIdx + " facet");

                            // wait for table rows to load
                            browser.wait(function () {
                                return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                                    return ct == facetParams.numRows;
                                });
                            }, browser.params.defaultTimeout);

                            return chaisePage.recordsetPage.getRows().count();
                        }).then(function(ct) {
                            expect(ct).toBe(facetParams.numRows, "number of rows is incorrect for facet at index: " + facetParams.facetIdx + " facet");

                            return chaisePage.recordsetPage.getFacetById(facetParams.facetIdx).click();
                        }).catch(function (exc) {
                            console.dir(exc);
                        });
                    });
                })(testParams.multipleFacets[i], i);
            }
        });

        describe("selecting facet options in sequence and verifying the data after all selections.", function () {
            beforeAll(function (done) {
                var clearAll = chaisePage.recordsetPage.getClearAllFilters();
                chaisePage.waitForElement(clearAll);

                chaisePage.clickButton(clearAll).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getClosedFacets().count().then(function(ct) {
                            return ct == testParams.totalNumFacets;
                        });
                    }, browser.params.defaultTimeout);

                    done();
                }).catch(function (err) {
                    console.dir(err);
                    done.fail();
                });
            });

            it("should open facets, click an option in each, and verify the data after", function (done) {
                var numFacets = testParams.multipleFacets.length;
                // open the four facets
                chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(testParams.multipleFacets[3].facetIdx)).then(function () {
                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(testParams.multipleFacets[2].facetIdx));
                }).then(function () {
                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(testParams.multipleFacets[1].facetIdx));
                }).then(function () {
                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetById(testParams.multipleFacets[0].facetIdx));
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getOpenFacets().count().then(function(ct) {
                            return ct == numFacets;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(testParams.multipleFacets[0].facetIdx, testParams.multipleFacets[0].option));
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedFacetOptions(testParams.multipleFacets[0].facetIdx).count().then(function(ct) {
                            return ct == 1;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(testParams.multipleFacets[1].facetIdx, testParams.multipleFacets[1].option));
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedFacetOptions(testParams.multipleFacets[1].facetIdx).count().then(function(ct) {
                            return ct == 1;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(testParams.multipleFacets[2].facetIdx, testParams.multipleFacets[2].option));
                }).then(function () {
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getCheckedFacetOptions(testParams.multipleFacets[2].facetIdx).count().then(function(ct) {
                            return ct == 1;
                        });
                    }, browser.params.defaultTimeout);
                    return chaisePage.clickButton(chaisePage.recordsetPage.getFacetOption(testParams.multipleFacets[3].facetIdx, testParams.multipleFacets[3].option));
                }).then(function () {
                    // wait for request to return
                    // wait for table rows to load
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getFacetFilters().count().then(function(ct) {
                            return ct == numFacets;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getFacetFilters().count();
                }).then(function (ct) {
                    expect(ct).toBe(numFacets, "Number of filters is incorrect after making 4 selections");

                    // wait for table rows to load
                    browser.wait(function () {
                        return chaisePage.recordsetPage.getRows().count().then(function(ct) {
                            return ct == testParams.multipleFacets[3].numRows;
                        });
                    }, browser.params.defaultTimeout);

                    return chaisePage.recordsetPage.getRows().count();
                }).then(function(ct) {
                    expect(ct).toBe(testParams.multipleFacets[3].numRows, "number of rows is incorrect after making multiple consecutive selections");
                    done();
                }).catch(function (err) {
                    done.fail(err);
                })
            });
        });
    });
});
