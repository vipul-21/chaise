var chaisePage = require('../utils/chaise.page.js');
var mustache = require('../../../../ermrestjs/vendor/mustache.min.js');
var fs = require('fs');
var EC = protractor.ExpectedConditions;

exports.testPresentation = function (tableParams) {
    var notNullColumns = tableParams.columns.filter(function (c) { return !c.hasOwnProperty("value") || c.value != null; });
    var pageReadyCondition = function () {
	    chaisePage.waitForElementInverse(element(by.id("spinner")));

	    // make sure the last related entity is visible
	    chaisePage.waitForElementInverse(element(by.id('rt-loading')));
	};

    beforeAll(function () {
        pageReadyCondition();
    });

	it("should have '" + tableParams.title +  "' as title", function() {
        var title = chaisePage.recordPage.getEntityTitleElement();
		chaisePage.waitForElement(title);
        expect(title.getText()).toEqual(tableParams.title);
	});

	it("should have '" + tableParams.subTitle +"' as subTitle", function() {
        var subtitle = chaisePage.recordPage.getEntitySubTitleElement();
		chaisePage.waitForElement(subtitle);
        expect(subtitle.getText()).toEqual(tableParams.subTitle);
	});

    it ("should have the correct table tooltip.", function () {
        expect(chaisePage.recordPage.getEntitySubTitleTooltip()).toBe(tableParams.tableComment);
    });

	it("should show " +notNullColumns.length + " columns only", function() {
		expect(chaisePage.recordPage.getColumns().count()).toBe(notNullColumns.length);
	});

    it("should show the action buttons properly", function() {
        var editButton = chaisePage.recordPage.getEditRecordButton(),
            createButton = chaisePage.recordPage.getCreateRecordButton(),
            deleteButton = chaisePage.recordPage.getDeleteRecordButton(),
            exportButton = chaisePage.recordsetPage.getExportDropdown(),
            showAllRTButton = chaisePage.recordPage.getShowAllRelatedEntitiesButton(),
            shareButton = chaisePage.recordPage.getShareButton();

        browser.wait(EC.elementToBeClickable(editButton), browser.params.defaultTimeout);
        browser.wait(EC.elementToBeClickable(createButton), browser.params.defaultTimeout);
        browser.wait(EC.elementToBeClickable(deleteButton), browser.params.defaultTimeout);
        browser.wait(EC.elementToBeClickable(showAllRTButton), browser.params.defaultTimeout);
        browser.wait(EC.elementToBeClickable(exportButton), browser.params.defaultTimeout);
        browser.wait(EC.elementToBeClickable(shareButton), browser.params.defaultTimeout);

        editButton.isDisplayed().then(function (bool) {
            expect(bool).toBeTruthy();
        });

        createButton.isDisplayed().then(function (bool) {
            expect(bool).toBeTruthy();
        });

        deleteButton.isDisplayed().then(function (bool) {
            expect(bool).toBeTruthy();
        });

        showAllRTButton.isDisplayed().then(function (bool) {
            expect(bool).toBeTruthy();
        });

        exportButton.isDisplayed().then(function (bool) {
            expect(bool).toBeTruthy();
        });

        shareButton.isDisplayed().then(function (bool) {
            expect(bool).toBeTruthy();
        });
    });

    describe("for share citation dialog,", function () {

        beforeAll(function (done) {
            var shareButton = chaisePage.recordPage.getShareButton(),
                shareModal = chaisePage.recordPage.getShareModal();

            browser.wait(EC.elementToBeClickable(shareButton), browser.params.defaultTimeout);

            shareButton.click().then(function () {
                // wait for dialog to open
                chaisePage.waitForElement(shareModal);
                // disable animations in modal so that it doesn't "fade out" (instead it instantly disappears when closed) which we can't track with waitFor conditions
                shareModal.allowAnimations(false);

                done();
            }).catch(function(err){
                console.log(err);
                done.fail();
            });
        });

        it("should show the share dialog when clicking the share button with 3 list elements.", function () {
            // verify modal dialog contents
            expect(chaisePage.recordEditPage.getModalTitle().element(by.tagName("strong")).getText()).toBe("Share", "Share citation modal title is incorrect");
            expect(chaisePage.recordPage.getModalListElements().count()).toBe(tableParams.citationParams.numListElements, "Number of list elements in share citation modal is incorrect");
        });

        it("should have a share header present.", function () {
            expect(chaisePage.recordPage.getShareLinkHeader().getText()).toBe("Share Link", "Share Link (permalink) header is incorrect");
        });

        it("should have a versioned link and permalink present.", function () {
            chaisePage.recordPage.getShareLinkSubHeaders().then(function (subheaders) {
                // verify versioned link
                expect(subheaders[0].getText()).toContain("Versioned Link", "versioned link header is incorrect");
                expect(chaisePage.recordPage.getVersionedLinkText().getText()).toContain(tableParams.citationParams.permalink, "versioned link url does not contain the permalink");

                // verify permalink
                expect(subheaders[1].getText()).toContain("Live Link", "versioned link header is incorrect");
                expect(chaisePage.recordPage.getPermalinkText().getText()).toBe(tableParams.citationParams.permalink, "permalink url is incorrect");
            })
        });

        it("should have 2 copy to clipboard icons visible.", function () {
            expect(element(by.id("share-link")).all(by.css(".glyphicon.glyphicon-copy")).count()).toBe(2, "wrong number of copy to clipboard icons");
        });

        // NOTE: the copy buttons functionality isn't being tested because it seems really hacky to test this feature
        xit("should have 2 copy to clipboard icons visible and verify they copy the content.", function () {
            var copyIcons, copyInput;

            element(by.id("share-link")).all(by.css(".glyphicon.glyphicon-copy")).then(function (icons) {
                copyIcons = icons;

                expect(icons.length).toBe(2, "wrong number of copy to clipboard icons");

                // click icon to copy text
                return copyIcons[0].click();
            }).then(function () {
                // creating a new input element
                return browser.executeScript(function () {
                    var el = document.createElement('input');
                    el.setAttribute('id', 'copy_input');

                    document.getElementById("share-link").appendChild(el);
                });
            }).then(function () {
                // use the browser to send the keys "ctrl/cmd" + "v" to paste contents
                copyInput = element(by.id("copy_input"));
                copyInput.sendKeys(protractor.Key.chord(protractor.Key.SHIFT, protractor.Key.INSERT));

                return chaisePage.recordPage.getVersionedLinkText().getText();
            }).then(function (versionedLink) {

                // select the input and get it's "value" attribute to verify the pasted contents
                expect(copyInput.getAttribute('value')).toBe(versionedLink, "copied text for versioned link is incorrect");
            });
        }).pend("Test case feels hacky to test a feature of the OS that can't be tested by just verifying the value was copied.");

        it("should have a citation present,", function () {
            // verify citation
            expect(chaisePage.recordPage.getCitationHeader().getText()).toBe("Data Citation", "Citation header is incorrect");
            expect(chaisePage.recordPage.getCitationText().getText()).toBe(tableParams.citationParams.citation, "citation text is incorrect");

            // verify download citation
            expect(chaisePage.recordPage.getDownloadCitationHeader().getText()).toBe("Download Data Citation:", "Download citation header is incorrect");
            expect(chaisePage.recordPage.getBibtex().getText()).toBe("BibTex", "bibtex text is incorrect");
        });

        if (!process.env.TRAVIS) {
            it("should download the citation in BibTex format.", function (done) {
                chaisePage.recordPage.getBibtex().click().then(function () {
                    browser.wait(function() {
                        return fs.existsSync(process.env.PWD + "/test/e2e/" + tableParams.file_names[2]);
                    }, browser.params.defaultTimeout).then(function () {
                        done();
                    }, function () {
                        expect(false).toBeTruthy(tableParams.file_names[2] + " was not downloaded");
                        done.fail();
                    });
                });
            });
        }

        afterAll(function (done){
            // close dialog
            chaisePage.recordEditPage.getModalTitle().element(by.tagName("button")).click().then(function () {
                done();
            }).catch(function(err){
                console.log(err);
                done.fail();
            });
        });
    });

    it("should have '2' options in the dropdown menu.", function (done) {
        var exportButton = chaisePage.recordsetPage.getExportDropdown();
        browser.wait(EC.elementToBeClickable(exportButton), browser.params.defaultTimeout);

        chaisePage.clickButton(exportButton).then(function () {
            expect(chaisePage.recordsetPage.getExportOptions().count()).toBe(2, "incorrect number of export options");
            // close the dropdown
            return chaisePage.recordsetPage.getExportDropdown().click();
        }).then(function () {
            done();
        }).catch(function (err) {
            console.log(err);
            done.fail();
        });
    });

    if (!process.env.TRAVIS) {
        it("should have 'CSV' as a download option and download the file.", function(done) {
            chaisePage.recordsetPage.getExportDropdown().click().then(function () {
                var csvOption = chaisePage.recordsetPage.getExportOption("CSV");
                expect(csvOption.getText()).toBe("CSV");
                return csvOption.click();
            }).then(function () {
                browser.wait(function() {
                    return fs.existsSync(process.env.PWD + "/test/e2e/" + tableParams.file_names[0]);
                }, browser.params.defaultTimeout).then(function () {
                    done();
                }, function () {
                    expect(false).toBeTruthy("Accommodations.csv was not downloaded");
                    done.fail();
                });
            }).catch(function (err) {
                console.log(err);
                done.fail();
            });
        });

        it("should have 'BDBag' as a download option and download the file.", function(done) {
            chaisePage.recordsetPage.getExportDropdown().click().then(function () {
                var bagOption = chaisePage.recordsetPage.getExportOption("BDBag");
                expect(bagOption.getText()).toBe("BDBag");
                return bagOption.click();
            }).then(function () {
                return chaisePage.waitForElement(chaisePage.recordsetPage.getExportModal());
            }).then(function () {
                return chaisePage.waitForElementInverse(chaisePage.recordsetPage.getExportModal());
            }).then(function () {
                browser.wait(function() {
                    return fs.existsSync(process.env.PWD + "/test/e2e/" + tableParams.file_names[1]);
                }, browser.params.defaultTimeout).then(function () {
                    done();
                }, function () {
                    expect(false).toBeTruthy("accommodation.zip was not downloaded");
                    done.fail();
                });
            }).catch(function (err) {
                console.log(err);
                done.fail();
            });
        });
    }

	it("should render columns which are specified to be visible and in order", function() {
		chaisePage.recordPage.getAllColumnCaptions().then(function(pageColumns) {
			expect(pageColumns.length).toBe(notNullColumns.length);
			var index = 0;
			pageColumns.forEach(function(c) {
                var col = notNullColumns[index++];
                expect(c.getText()).toEqual(col.title);
			});
		});
	});

	it("should show line under columns which have a comment and inspect the comment value too", function() {
		var columns = notNullColumns.filter(function(c) {
            return (typeof c.comment == 'string');
        });
		chaisePage.recordPage.getColumnsWithUnderline().then(function(pageColumns) {
			expect(pageColumns.length).toBe(columns.length);
			var index = 0;
			pageColumns.forEach(function(c) {
				var comment = columns[index++].comment;
				chaisePage.recordPage.getColumnComment(c).then(function(actualComment) {
					var exists = actualComment ? true : undefined;
					expect(exists).toBeDefined();

					// Check comment is same
                    expect(actualComment).toBe(comment);
				});
			});
		});
	});

    it("should render columns based on their markdown pattern.", function(done) {
        var columns = tableParams.columns.filter(function(c) {return c.markdown_title;});
        chaisePage.recordPage.getColumnCaptionsWithHtml().then(function(pageColumns) {
            expect(pageColumns.length).toBe(columns.length, "number of captions with markdown name doesn't match.");
            pageColumns.forEach(function(c, i) {
                var col = columns[i];
                c.getAttribute("innerHTML").then(function(html) {
                    expect(html).toBe(col.markdown_title, "invalid name for column `" +  col.title + "`.");
                    if (i === pageColumns.length - 1) done();
                }).catch(function (err) {
                    done.fail(err);
                })
            });
        }).catch(function (err) {
            done.fail(err);
        })
    });

    it("should validate the values of each column", function () {
        expect(element.all(by.className('entity-value')).count()).toEqual(notNullColumns.length, "length missmatch.");
        var index = -1, columnUrl, aTag;
        notNullColumns.forEach(function (column) {
            if (!column.hasOwnProperty("value")) {
                return;
            }

            var errMessage = "value mismatch for column " + column.title;

            var columnEls;
            if (column.title=='booking') {
                // get the value at row 5 of the table list of values
                expect(element(by.id('entity-4-markdown')).element(by.css('.markdown-container')).getAttribute('innerHTML')).toContain(column.value, errMessage);
            } else if (column.match=='html') {
                expect(chaisePage.recordPage.getEntityRelatedTableScope(column.title).getAttribute('innerHTML')).toBe(column.value, errMessage);
            } else if (column.title == 'User Rating'){
                expect(chaisePage.recordPage.getEntityRelatedTableScope('&lt;strong&gt;User&nbsp;Rating&lt;/strong&gt;',true).getAttribute('innerHTML')).toBe(column.value, errMessage);
            } else {
                columnEls = chaisePage.recordPage.getEntityRelatedTable(column.title);
                if (column.presentation) {
                    if (column.presentation.type === "inline") columnEls = chaisePage.recordPage.getMarkdownContainer(columnEls);

                    chaisePage.recordPage.getLinkChild(columnEls).then(function (aTag) {
                        var dataRow = chaisePage.getEntityRow("product-record", column.presentation.table_name, column.presentation.key_value);
                        columnUrl = mustache.render(column.presentation.template, {
                            "catalog_id": process.env.catalogId,
                            "chaise_url": process.env.CHAISE_BASE_URL,
                        });
                        columnUrl += "RID=" + dataRow.RID;

                        expect(aTag.getAttribute('href')).toContain(columnUrl, errMessage + " for url");
                        expect(aTag.getText()).toEqual(column.value, errMessage + " for caption");
                    });
                } else {
                    expect(columnEls.getAttribute('innerText')).toBe(column.value, errMessage);
                }
        	}
        });
    });

    it('should not show any columns with null value', function() {
        var columns = tableParams.columns;
        columns.forEach(function(column) {
            var elem = element(by.id('row-' + column.title.toLowerCase()));
            if (column.value === null) {
                expect(elem.isPresent()).toBe(false);
            }
        });
    });

    it("should show related table names and their tables", function() {
        var displayName, tableCount, title,
            relatedTables = tableParams.related_tables;

        browser.wait(EC.not(EC.visibilityOf(chaisePage.recordPage.getLoadingElement())), browser.params.defaultTimeout);
        browser.wait(function() {
            return chaisePage.recordPage.getRelatedTablesWithPanelandHeading().count().then(function(ct) {
                return (ct=relatedTables.length);
            });
        }, browser.params.defaultTimeout);
        chaisePage.recordPage.getRelatedTablesWithPanelandHeading().count().then(function(count) {
            expect(count).toBe(relatedTables.length,'Mismatch in Related table count!');
            tableCount = count;

            // check the headings have the right name and in the right order
            return chaisePage.recordPage.getRelatedTableTitles();
        }).then(function(headings) {
            // tables should be in order based on annotation for visible foreign_keys
            // Headings have a '-' when page loads, and a count after them
            expect(headings).toEqual(tableParams.tables_order,"Order is not maintained for related tables!");

            // rely on the UI data for looping, not expectation data
            for (var i = 0; i < tableCount; i++) {
                displayName = relatedTables[i].displayname;
                title = relatedTables[i].title;

                // verify all columns are present
                (function(i, displayName, title) {
                    chaisePage.recordPage.getRelatedTableColumnNamesByTable(displayName).getAttribute('innerHTML').then(function(columnNames) {
                        var index = 0, systemColumns = ["RID", "RCT", "RMT", "RCB", "RMB"];
                        for (var j = 0; j < columnNames.length; j++) {
                            if (systemColumns.indexOf(columnNames[j]) === -1) {
                                expect(columnNames[j]).toBe(relatedTables[i].columns[index]);
                                index++;
                            }
                        }

                        // verify all rows are present
                        return chaisePage.recordPage.getRelatedTableRows(displayName).count();
                    }).then(function(rowCount) {
                        expect(rowCount).toBe(relatedTables[i].data.length);

                        // Because this spec is reused in multiple recordedit tests, this if-else branching just ensures the correct expectation is used depending on which table is encountered
                        if (displayName == tableParams.related_table_name_with_page_size_annotation) {
                            // The annotation_image table has more rows than the page_size, so its heading will have a + after the row count
                            expect(headings[i]).toBe(title + " (showing first " + rowCount + " results)");
                        } else if (rowCount == 0) {
                            // All other tables should not have the + at the end its heading
                            expect(headings[i]).toBe(title + " (no results found)");
                        } else {
                            expect(headings[i]).toBe(title + " (showing all " + rowCount + " results)");
                        }
                    });
                })(i, displayName, title);
            }
        });
    });

    it("click event on image_id in inline display should open new tab with file details",function(){
        var allHandle;
        browser.executeScript("return $('a.toggle-display-link').click()").then(function () {
            return chaisePage.waitForElement(element(by.id('entity-booking')))
        }).then(function () {
          // This selector captures link of first record under image_id column (5th column) of booking inline entry
            return browser.executeScript("return $('.t_booking td:nth-child(5) a')");
        }).then(function(imageLinks){
            browser.executeScript("return window.open(arguments[0], '_blank')", imageLinks[0]);
            return browser.getAllWindowHandles();
        }).then(function (handles){
            allHandle = handles;
            browser.switchTo().window(allHandle[1]);
            chaisePage.waitForElement(chaisePage.recordPage.getEntityTitleElement());
            return chaisePage.recordPage.getEntityTitle();
        }).then(function (pageTitle) {
            expect(pageTitle).toBe("3005", "Page title did not match. Invalid image id");
            return chaisePage.recordPage.getEntitySubTitle();
        }).then(function (pageSubTitle){
            expect(pageSubTitle).toBe("file", "Page subtitle did not match. Invalid image id");
            browser.close();
            browser.switchTo().window(allHandle[0]);
        }).catch(function(err){
            console.log(err);
            expect('Encountered an error').toBe('Please check the log', 'Inside catch block');
            browser.close();
            browser.switchTo().window(allHandle[0]);
        })
    });

    it("visible column related table with inline inbound fk should display 'None' in markdown display mode if no data was found.",function(done){
        var EC = protractor.ExpectedConditions,
            markdownEntity = element(by.id('entity-4-markdown')), //TODO this should be a function, it's also is assuming the order
            bookingName = "booking";

		var confirmButton = chaisePage.recordPage.getConfirmDeleteButton();
		var getRowDeleteBtn = function (index) {
			return chaisePage.recordPage.getRelatedTableRowDelete(bookingName, index, true);
		}

		chaisePage.waitForElement(element(by.id("rt-" + bookingName)));

		// delete the first row
        chaisePage.clickButton(getRowDeleteBtn(0)).then(function(){
			browser.wait(EC.visibilityOf(confirmButton), browser.params.defaultTimeout);
			return chaisePage.clickButton(confirmButton);
        }).then(function () {
			chaisePage.waitForElementInverse(element(by.id("spinner")));

            // make sure there is 1 row
            browser.wait(function() {
                return chaisePage.recordPage.getRelatedTableRows(bookingName).count().then(function(ct) {
                    return (ct==1);
                });
            }, browser.params.defaultTimeout);

			// delete the other row
            return chaisePage.clickButton(getRowDeleteBtn(0));
        }).then(function () {
			browser.wait(EC.visibilityOf(confirmButton), browser.params.defaultTimeout);
			return chaisePage.clickButton(confirmButton);
		}).then(function () {
			chaisePage.waitForElementInverse(element(by.id("spinner")));

			// make sure there are zero rows
            browser.wait(function() {
                return chaisePage.recordPage.getRelatedTableRows(bookingName).count().then(function(ct) {
                    return (ct==0);
                });
            }, browser.params.defaultTimeout);

			// switch the display mode
			return chaisePage.clickButton(chaisePage.recordPage.getToggleDisplayLink(bookingName, true));
        }).then(function(){
            browser.wait(EC.visibilityOf(markdownEntity), browser.params.defaultTimeout);
            expect(markdownEntity.getText()).toBe('None',"Incorrect text for empty markdown!");
			done();
        }).catch(function(err){
            console.log(err);
            done.fail();
        });
    });

    it("empty inline inbound fks should disappear when 'Hide All Related Records' was clicked.",function(done){
        var showAllRTButton = chaisePage.recordPage.getShowAllRelatedEntitiesButton();

		chaisePage.clickButton(showAllRTButton).then(function () {
			expect(chaisePage.recordPage.getEntityRelatedTable("booking").isPresent()).toBeFalsy();
			return chaisePage.clickButton(showAllRTButton);
		}).then(function () {
			done();
		}).catch(function(err){
            console.log(err);
            done.fail();
        });
    });

    // Related tables are contextualized with `compact/brief`, but if that is not specified it will inherit from `compact`
    it("should honor the page_size annotation for the table, file, in the compact context based on inheritance.", function() {
        var relatedTableName = tableParams.related_table_name_with_page_size_annotation;

        chaisePage.recordPage.getRelatedTableRows(relatedTableName).count().then(function(count) {
            expect(count).toBe(tableParams.page_size);
        });
    });

    it("clicking the related table heading should change the heading and hide the table.", function(done) {
        var relatedTable = tableParams.related_tables[0];
        var displayName = relatedTable.title;
        var tableHeading = chaisePage.recordPage.getRelatedTableHeading(displayName),
            tableElement = chaisePage.recordPage.getRelatedTable(displayName);

		// TODO this test is using too many css classes which should be functions in chaise.page.js
        tableHeading.element(by.css('.glyphicon')).getAttribute('class').then(function(cssClass) {
            // related table should be open by default
            expect(cssClass).toContain('glyphicon-chevron-down');

            return tableHeading.getAttribute("class");
        }).then(function(attribute) {
            expect(attribute).toMatch("panel-open");
            chaisePage.waitForElement(element(by.css(".accordion-toggle")));
            return chaisePage.clickButton(tableHeading.element(by.css(".accordion-toggle")));
        }).then(function() {
            return tableHeading.getAttribute("heading");
        }).then(function(heading) {
            // related table should be closed now and a '+' should be shown instead of a '-'
            expect(tableHeading.element(by.css('.glyphicon')).getAttribute('class')).toContain('glyphicon-chevron-right');
            return tableHeading.getAttribute("class");
        }).then(function(attribute) {
            expect(attribute).not.toMatch("panel-open");
			done();
        }).catch(function (err) {
			console.log(err);
			done.fail();
		})
    });

    // There is a media table linked to accommodations but this accommodation (Sheraton Hotel) doesn't have any media
    it("should show and hide a related table with zero values upon clicking a link to toggle visibility of related entities", function(done) {
        var showAllRTButton = chaisePage.recordPage.getShowAllRelatedEntitiesButton(),
            tableDisplayname = "<strong>media</strong>",
            noResultsMessage = "No Results Found";
         chaisePage.clickButton(showAllRTButton).then(function() {
            expect(chaisePage.recordPage.getRelatedTable(tableDisplayname).isDisplayed()).toBeFalsy("first click: didn't hide.");
            return  chaisePage.clickButton(showAllRTButton);
        }).then(function() {
            // empty related table should show
            expect(chaisePage.recordPage.getRelatedTable(tableDisplayname).isDisplayed()).toBeTruthy("second click: didn't show.");
            //check the no results text appears properly
            return chaisePage.recordPage.getNoResultsRow(tableDisplayname);
        }).then(function(emptyTab) {
            expect(emptyTab.getText()).toBe(noResultsMessage, "message missmatch.");
            return  chaisePage.clickButton(showAllRTButton);
        }).then(function() {
            expect(chaisePage.recordPage.getRelatedTable(tableDisplayname).isDisplayed()).toBeFalsy("third click: didn't hide.");
            done();
        }).catch(function(error) {
            done.fail(error);
        });
    });

    it("should show the related table names in the correct order in the Table of Contents (including inline)", function () {
        expect(chaisePage.recordPage.getSidePanelTableTitles()).toEqual(tableParams.tocHeaders, "list of related tables in toc is incorrect");
    });

    describe("regarding inline related entities, ", function () {
        beforeAll(function () {
            // make sure page is in its initial state
            browser.driver.navigate().refresh();
        });
        for (var i = 0; i < tableParams.inline_columns.length; i++) {
            var p = tableParams.inline_columns[i];
            p.baseTable = tableParams.subTitle;
            describe ("for " + p.title + ", ", function (){
                exports.testRelatedTable(p, pageReadyCondition);
            });
        }
    });
};

/**
 * required attributes:
 * name
 * schemaName
 * displayname
 * count
 * canEdit
 * canCreate
 * canDelete
 * optional attributes:
 * isAssociation
 * isMarkdown
 * isInline
 * isTableMode
 * viewMore:
 *  - name
 *  - displayname
 *  - filter
 * rowValues
 * rowViewPaths
 * markdownValue
 * page_size (default 25)
 *
 *
 * testAdd
 * testEdit
 * testDelete
 */
exports.testRelatedTable = function (params, pageReadyCondition) {
	var currentEl, markdownToggleLink, toggled = false;
	beforeAll(function() {
		pageReadyCondition();

		if (params.isInline) {
			currentEl = chaisePage.recordPage.getEntityRelatedTable(params.displayname);
		} else {
			currentEl = chaisePage.recordPage.getRelatedTableHeading(params.displayname);
		}

		markdownToggleLink = chaisePage.recordPage.getToggleDisplayLink(params.displayname, params.isInline);
	});

	var testHeading = function (count, page_size) {
		page_size = page_size || 25;

		var heading = chaisePage.recordPage.getRelatedTableHeadingTitle(params.displayname);
		var title = params.displayname;
		if (count === 0) {
			title += " (no results found)";
	    } else if (count < page_size) {
			title += " (showing all " + count + " results)";
		} else {
			title += " (showing first " + page_size + " results)"
		}
		expect(heading.getText()).toBe(title, "heading missmatch.");
	};

	if (!params.isInline) {
		it ("title should be correct.", function () {
			testHeading(params.count, params.page_size);
		});
	}

	describe("regarding table level actions, ", function () {

		// View More
		describe("`View More` button, ", function () {
			var viewMoreBtn;
			beforeAll(function () {
				viewMoreBtn = chaisePage.recordPage.getMoreResultsLink(params.displayname, params.isInline);
				browser.wait(EC.elementToBeClickable(viewMoreBtn), browser.params.defaultTimeout);
			});

			it ('should be displayed.', function () {
				expect(viewMoreBtn.isDisplayed()).toBeTruthy("view more is not visible.");
			});

			it('should have the correct tooltip.', function(){
				chaisePage.recordPage.getColumnCommentHTML(viewMoreBtn).then(function(comment){
					expect(comment).toBe("'View more " + params.displayname + " related to this " + params.baseTable + "'", "Incorrect tooltip on View More button");
				});
			});

			if (params.viewMore){
				it ("should always go to recordset app with correct set of filters.", function (done) {
					chaisePage.clickButton(viewMoreBtn).then(function () {
						return browser.driver.getCurrentUrl();
					}).then(function(url) {
                        expect(url.indexOf('recordset')).toBeGreaterThan(-1, "didn't go to recordset app");
                        return chaisePage.waitForElement(element(by.id("divRecordSet")));
                    }).then(function() {
                        expect(chaisePage.recordsetPage.getPageTitleElement().getText()).toBe(params.viewMore.displayname, "title missmatch.");
                        expect(chaisePage.recordsetPage.getFacetFilters().isPresent()).toBe(true, "filter was not present");
                        expect(chaisePage.recordsetPage.getFacetFilters().first().getText()).toEqual(params.viewMore.filter, "filter missmatch.");
						browser.navigate().back();
						pageReadyCondition();
						done();

					}).catch(function (err) {
                        browser.navigate().back();
						pageReadyCondition();
						done.fail(err);
					})
				});
			}
		});

		// Display Mode
		describe("view mode and rows, ", function () {

			if (params.isMarkdown || (params.isInline && !params.isTableMode)) {
				it ("markdown container must be visible.", function () {
                    chaisePage.waitForElement(currentEl.element(by.css('.markdown-container')));
					expect(currentEl.element(by.css('.markdown-container')).isDisplayed()).toBeTruthy("didn't have markdown");
				});

				if (params.markdownValue) {
					it ("correct markdown values should be visible.", function () {
						expect(currentEl.element(by.css('.markdown-container')).getAttribute('innerHTML')).toEqual(params.markdownValue)
					});
				}

				if (params.canEdit) {
					it ("`Edit` button should be visible to switch to tabular mode.", function () {
						// revert is `Display`
						expect(markdownToggleLink.isDisplayed()).toBeTruthy();
						expect(markdownToggleLink.getText()).toBe("Edit");
						chaisePage.recordPage.getColumnCommentHTML(markdownToggleLink.element(by.cssContainingText(".hide-tooltip-border", "Edit"))).then(function(comment){
							expect(comment).toBe("'Edit " + params.displayname + " related to this " + params.baseTable + "'", "Incorrect tooltip on Edit button");
						});
					});
				} else {
					it ("`Table Display` button should be visible to switch to tabular mode.", function () {
						// revert is `Revert Display`
						expect(markdownToggleLink.isDisplayed()).toBeTruthy();
						expect(markdownToggleLink.getText()).toBe("Table Display");
						chaisePage.recordPage.getColumnCommentHTML(markdownToggleLink.element(by.cssContainingText(".hide-tooltip-border", "Table Display"))).then(function(comment){
							expect(comment).toBe("'Display related " + params.displayname + " in tabular mode'", "Incorrect tooltip on Table Display button");
						});
					});
				}

				it ("clicking on the toggle should change the view to tabular.", function (done) {
					chaisePage.clickButton(markdownToggleLink).then(function() {
						if (params.canEdit) {
							expect(markdownToggleLink.getText()).toBe("Display", "after toggle button missmatch.");
							chaisePage.recordPage.getColumnComment(markdownToggleLink.element(by.cssContainingText(".hide-tooltip-border", "Display"))).then(function(comment){
								expect(comment).toBe("Switch back to the display mode", "Incorrect tooltip on Display button");
							});
						} else {
							expect(markdownToggleLink.getText()).toBe("Revert Display", "after toggle button missmatch.");
							chaisePage.recordPage.getColumnComment(markdownToggleLink.element(by.cssContainingText(".hide-tooltip-border", "Revert Display"))).then(function(comment){
								expect(comment).toBe("Switch back to the previous display", "Incorrect tooltip on Revert Display button");
							});
						}

						//TODO make sure table is visible
						toggled = true;
						done();
					}).catch(function(error) {
						console.log(error);
						done.fail();
					});
				});

			} else {
				it ("option for different display modes should not be presented to user.", function () {
					expect(markdownToggleLink.isPresent()).toBe(false);
				});
			}

			if (params.rowValues) {
				// since we toggled to row, the data should be available.
				it ("rows of data should be correct and respect the given page_size.", function (done) {
                    // wait for table to be visible before waiting for it's contents to load
                    viewMoreBtn = chaisePage.recordPage.getMoreResultsLink(params.displayname, params.isInline);
                    browser.wait(EC.elementToBeClickable(viewMoreBtn), browser.params.defaultTimeout);
                    // make sure the right # of rows are showing before verifying the contents
                    browser.wait(function() {
                        return chaisePage.recordPage.getRelatedTableRows(params.displayname, params.isInline).count().then(function(ct) {
                            return (ct == params.rowValues.length);
                        });
                    }, browser.params.defaultTimeout);
					checkRelatedRowValues(params.displayname, params.isInline, params.rowValues, done);
				});
			}
		});

		if (typeof params.canCreate === "boolean") {
			it ("`Add` button should be " + (params.canCreate ? "visible." : "invisible."), function () {
				var addBtn = chaisePage.recordPage.getAddRecordLink(params.displayname, params.isInline);
				expect(addBtn.isPresent()).toBe(params.canCreate);
				if(params.canCreate){
					chaisePage.recordPage.getColumnCommentHTML(addBtn).then(function(comment){
						expect(comment).toBe("'Add more " + params.displayname + " related to this " + params.baseTable + "'", "Incorrect tooltip on Add button");
					});
				}
			});
		 }
	});

	// in our test cases we are changing the view to tabular
	describe("regarding row level actions, ", function () {

		if (params.rowViewPaths) {
			it ("'View Details' button should have the correct link.", function () {
                var tableName = (params.isAssociation ? params.relatedName : params.name);
				params.rowViewPaths.forEach(function (row, index) {
                    var expected = '/record/#' + browser.params.catalogId + "/" + params.schemaName + ":" + tableName + "/";
                    var dataRow = chaisePage.getEntityRow(params.schemaName, tableName, row);
                    expected += "RID=" + dataRow.RID;
					var btn = chaisePage.recordPage.getRelatedTableRowLink(params.displayname, index, params.isInline);
					expect(btn.getAttribute('href')).toContain(expected, "link missmatch for index=" + index);
				});
			});
		}

		if (typeof params.canEdit === "boolean") {
			if (!params.canEdit) {
				it ("edit button should not be visible.", function () {
					expect(currentEl.all(by.css(".edit-action-button")).isPresent()).not.toBeTruthy();
				});
			} else if (params.rowViewPaths || params.rowEditPaths) {
				it ("clicking on 'edit` button should open a tab to recordedit page.", function (done) {
					var btn = chaisePage.recordPage.getRelatedTableRowEdit(params.displayname, 0, params.isInline);

					expect(btn.isDisplayed()).toBeTruthy("edit button is missing.");
					chaisePage.clickButton(btn).then(function () {
						return browser.getAllWindowHandles();
					}).then(function(handles) {
						allWindows = handles;
						return browser.switchTo().window(allWindows[1]);
					}).then(function() {
						var result = '/recordedit/#' + browser.params.catalogId + "/" + params.schemaName + ":" + params.name;

						// in case of association edit and view are different
						result += "/" + (params.rowEditPaths ? params.rowEditPaths[0] : "RID=" + chaisePage.getEntityRow(params.schemaName, params.name, params.rowViewPaths[0]).RID);

						expect(browser.driver.getCurrentUrl()).toContain(result, "expected link missmatch.");
						browser.close();
						return browser.switchTo().window(allWindows[0]);
					}).then(function (){
						done();
					}).catch(function (err) {
						console.log(err);
						done.fail();
					});
				});
			}
		}

		if (typeof params.canDelete === "boolean") {
			describe("`Delete` or `Unlink` button, ", function () {
				var deleteBtn;
				beforeAll(function () {
					deleteBtn = chaisePage.recordPage.getRelatedTableRowDelete(params.displayname, 0, params.isInline);
				})
				if (params.canDelete) {
					it ('should be visible.', function () {
						expect(deleteBtn.isDisplayed()).toBeTruthy("delete button is missing.");
					});

					if (params.isAssociation) {
						it ("button tooltip should be `Unlink`.", function () {
							expect(deleteBtn.getAttribute("uib-tooltip")).toBe("Unlink");
						});
					} else {
						it ("button tooltip be `Delete`.", function () {
							expect(deleteBtn.getAttribute("uib-tooltip")).toBe("Delete");
						});
					}

					it ("it should update the table and title after confirmation.", function (done) {
						var currentCount;
						chaisePage.recordPage.getRelatedTableRows(params.displayname, params.isInline).count().then(function (count) {
							currentCount = count;
							return chaisePage.clickButton(deleteBtn);
						}).then(function () {
							var confirmButton = chaisePage.recordPage.getConfirmDeleteButton();
		                    browser.wait(EC.visibilityOf(confirmButton), browser.params.defaultTimeout);

							return confirmButton.click();
						}).then(function () {
							chaisePage.waitForElementInverse(element(by.id("spinner")));

                            // make sure the rows are updated
                            browser.wait(function() {
                                return chaisePage.recordPage.getRelatedTableRows(params.displayname, params.isInline).count().then(function(ct) {
                                    return (ct == currentCount-1);
                                });
                            }, browser.params.defaultTimeout);

							return chaisePage.recordPage.getRelatedTableRows(params.displayname, params.isInline).count();
						}).then(function (count) {
							expect(count).toBe(currentCount-1, "count didn't change.");
							testHeading(count, params.page_size);
							done();
						}).catch(function (err) {
							console.log(err);
							done.fail();
						})
					});

				} else {
					it ("should not be visible.", function () {
						expect(deleteBtn.isDisplayed()).toBe(false, "delete button was visible.");
					});
				}
			});
		}
	});

	// if it was markdown, we are changing the view, change it back.
	afterAll(function (done) {
		if (toggled) {
			chaisePage.clickButton(markdownToggleLink).then(function() {
				done();
			}).catch(function(error) {
				console.log(error);
				done.fail();
			});
		} else {
			done();
		}
	});
};

/**
 * required attributes:
 *  - tableName
 *  - schemaName
 *  - relatedDisplayname
 *  - prefilledValues: {"col-displayname": "col-value", ..}
 *  - columnValue
 */
exports.testAddRelatedTable = function (params, isInline, inputCallback) {
	describe("Add feature, ", function () {
		it ("clicking on `Add` button should open recordedit.", function (done) {
			var addBtn = chaisePage.recordPage.getAddRecordLink(params.relatedDisplayname);
			var recordeditUrl = browser.params.url + '/recordedit/#' + browser.params.catalogId + "/" +
								params.schemaName + ":" + params.tableName;

			expect(addBtn.isDisplayed()).toBeTruthy("add button is not displayed");
			chaisePage.clickButton(addBtn).then(function () {
				// This Add link opens in a new tab so we have to track the windows in the browser...
				return browser.getAllWindowHandles();
			}).then(function(handles) {
				allWindows = handles;
				// ... and switch to the new tab here...
				return browser.switchTo().window(allWindows[1]);
			}).then(function() {
				return chaisePage.waitForElement(element(by.id('submit-record-button')));
			}).then(function() {

				browser.wait(function () {
					return browser.driver.getCurrentUrl().then(function(url) {
						return url.startsWith(recordeditUrl);
					});
				}, browser.params.defaultTimeout);

				// ... and then get the url from this new tab...
				return browser.driver.getCurrentUrl();
			}).then(function(url) {
				expect(url.indexOf('prefill=')).toBeGreaterThan(-1, "didn't have prefill");

				var title = chaisePage.recordEditPage.getFormTitle().getText();
				expect(title).toBe("Create Record", "recordedit title missmatch.")

				done();
			}).catch(function (err) {
				console.log(err);
				done.fail();
			});
		});

		it ("the opened form should have the prefill value for foreignkey.", function () {
            for (var col in params.prefilledValues) {
                var fkInput = chaisePage.recordEditPage.getInputById(0, col);
                expect(fkInput.getAttribute('value')).toBe(params.prefilledValues[col], "value missmatch for " + col);
                expect(fkInput.getAttribute('disabled')).toBe(params.prefilledValues[col] === "" ? null : 'true', "disabled missmatch for " + col);
            }
		});

		it ("submitting the form and coming back to recordset page should update the related table.", function (done) {
			inputCallback().then(function () {
				return chaisePage.recordEditPage.submitForm();
			}).then(function() {
				// wait until redirected to record page
				browser.wait(EC.presenceOf(element(by.id('page-title'))), browser.params.defaultTimeout);
                browser.close();
				return browser.switchTo().window(allWindows[0]);
            }).then(function () {
                //TODO should remove this, but sometimes it's not working in test cases
                browser.driver.navigate().refresh();

                // check for the updated value.
				//there's no loading indocator, so we have to wait for count
                browser.wait(function () {
                    return chaisePage.recordPage.getRelatedTableRows(params.relatedDisplayname, isInline).count().then(function (cnt) {
                        return cnt === params.rowValuesAfter.length;
                    }, function (err) {throw err;});
                });
                checkRelatedRowValues(params.relatedDisplayname, isInline, params.rowValuesAfter, done);
			}).catch(function(error) {
				console.log(error);
				done.fail();
			});
		});
	});
};

/**
 * - relatedDisplayname
 * - tableDisplayname
 * - totalCount
 * - existingCount
 * - disabledRows
 * - selectIndex
 */
exports.testAddAssociationTable = function (params, isInline, pageReadyCondition) {
	describe("Add feature, ", function () {
		it ("clicking on `Add` button should open up a modal.", function (done) {
			var addBtn = chaisePage.recordPage.getAddRecordLink(params.relatedDisplayname);
			chaisePage.clickButton(addBtn).then(function () {
				chaisePage.waitForElement(chaisePage.recordEditPage.getModalTitle());
				return chaisePage.recordEditPage.getModalTitle().getText();
			}).then(function (title) {
				expect(title).toBe("Choose " + params.tableDisplayname, "title missmatch.");

				browser.wait(function () {
					return chaisePage.recordsetPage.getModalRows().count().then(function (ct) {
						return (ct == params.totalCount);
					});
				});

				return chaisePage.recordsetPage.getModalRows().count();
			}).then(function(ct){
				expect(ct).toBe(params.totalCount, "association count missmatch.");
				done();
			}).catch(function(error) {
				console.log(error);
				done.fail();
			});
		});

		it ("current values must be disabled.", function (done) {
			chaisePage.recordPage.getModalDisabledRows().then(function (disabledRows) {
				expect(disabledRows.length).toBe(params.disabledRows.length, "disabled length missmatch.");


				// go through the list and check their first column (which is the id)
				disabledRows.forEach(function (r, index) {
					r.findElement(by.css("td:not(.actions-layout)")).then(function (el) {
						expect(el.getText()).toMatch(params.disabledRows[index], "missmatch disabled row index=" + index);
					});
				});

				done();
			}).catch(function(error) {
				console.log(error);
				done.fail();
			});
		});

		it ("user should be able to select new values and submit.", function (done) {
			var inp = chaisePage.recordsetPage.getModalRecordsetTableOptionByIndex(params.selectIndex);
			chaisePage.clickButton(inp).then(function (){
				return chaisePage.clickButton(chaisePage.recordsetPage.getModalSubmit());
			}).then(function () {
				browser.wait(EC.presenceOf(element(by.id('page-title'))), browser.params.defaultTimeout);
                browser.wait(function () {
					return chaisePage.recordPage.getRelatedTableRows(params.relatedDisplayname, isInline).then(function (rows) {
						return (rows.length == params.existingCount+1);
					});
				});
                checkRelatedRowValues(params.relatedDisplayname, isInline, params.rowValuesAfter, done);

				return chaisePage.recordPage.getRelatedTableRows(params.relatedDisplayname).count();
			}).then(function (count){
				expect(count).toBe(params.existingCount + 1);
				done();
			}).catch(function(error) {
				console.log(error);
				done.fail();
			});
		});

	});
};


function checkRelatedRowValues(displayname, isInline, rowValues, done) {
    chaisePage.recordPage.getRelatedTableRows(displayname, isInline).then(function (rows) {
        expect(rows.length).toBe(rowValues.length, "rows length mismatch.");
        if (rows.length === 0) {
            done();
        }
        rows.forEach(function (row, index) {
            row.all(by.tagName("td")).then(function (cells) {
                expect(cells.length).toBe(rowValues[index].length + 1, "number of columns are not as expected.");
                rowValues[index].forEach(function (expectedRow, columnIndex) {
                    if (typeof expectedRow === "object" && expectedRow.url) {
                        expect(cells[columnIndex+1].element(by.tagName("a")).getAttribute("href")).toContain(expectedRow.url, "link missmatch for row=" + index + ", columnIndex=" + columnIndex);
                        expect(cells[columnIndex+1].element(by.tagName("a")).getText()).toBe(expectedRow.caption, "caption missmatch for row=" + index  + ", columnIndex=" + columnIndex);
                    } else {
                        expect(cells[columnIndex+1].getText()).toBe(expectedRow, "mismatch for row=" + index  + ", columnIndex=" + columnIndex);
                    }
                });
                done();
            }).catch(function (err) {
                throw err;
            });
        });
    }).catch(function(error) {
        console.log(error);
        done.fail();
    });
}
