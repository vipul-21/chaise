// Configure deployment-specific data here

var chaiseConfig = {
    name: "Sample",
    layout: 'list',
    allowErrorDismissal: true,
    confirmDelete: true,
    headTitle: 'Chaise',
    customCSS: '/assets/css/chaise.css',
    navbarBrand: '/',
    navbarBrandImage: null,
    logoutURL: '/image-annotation',
    // signUpURL: '', The URL at a which a user can create a new account
    // profileURL: '', Globus deployments can use https://www.globus.org/app/account
    dataBrowser: '',
    maxColumns: 6,
    showUnfilteredResults: false,
    defaultAnnotationColor: 'red',
    feedbackURL: 'http://goo.gl/forms/f30sfheh4H',
    helpURL: '/help/using-the-data-browser/',
    showBadgeCounts: false,
    plotViewEnabled: false,
    recordUiGridEnabled: false,
    recordUiGridExportCSVEnabled: true,
    recordUiGridExportPDFEnabled: true,
    editRecord: true,
    deleteRecord: true,
    maxRecordsetRowHeight: 160,
    showFaceting: true,
    tour: {
      pickRandom: false,
      searchInputAttribute: "Data",
      searchChosenAttribute: "Data Type",
      searchInputValue: "micro",
      extraAttribute: "Mouse Anatomic Source",
      chosenAttribute: "Data Type",
      chosenValue: "Expression microarray - gene"
    },
    navbarMenu: {
        // The optional newTab property can be defined at any level. If undefined at root, newTab is treated as true
        // Each child menu item checks for a newTab property on itself, if nothing is set, the child inherits from it's parent.
        newTab: true,
        children: [
            // {
            //     // This "Search" menu item has 2 nested dropdowns.
            //     // Use the "name" key to label a menu item.
            //     // Use the "children" key to specify dropdowns; you can nest as many dropdowns as you need.
            //     name: "Search",
            //     children: [
            //         {
            //             name: "Search 1",
            //             children: [
            //                 {
            //                     name: "Search 1.1",
            //                     url: "/chaise/search/#1/YOUR_SCHEMA:YOUR_TABLE"
            //                 }
            //             ]
            //         }
            //     ]
            // },
            // {
            //     // This "Create" menu item doesn't have any dropdowns.
            //     // Use the "url" key to specify this menu item's url
            //     // URLs can be absolute or relative to the document root.
            //     name: "Create",
            //     url: "/chaise/recordedit/#1/YOUR_SCHEMA:YOUR_TABLE"
            // },
            // {
            //      // URLs support templating primarily for catalog substition
            //     name: "Create",
            //     url: "/chaise/recordedit/#{{$catalog.snapshot}}/YOUR_SCHEMA:YOUR_TABLE"
            // }
        ]
    },
    footerMarkdown: "**Please check** [Privacy Policy](/privacy-policy/){target='_blank'}",
    maxRelatedTablesOpen: 15,
    configRules: [
        {
            host: ["www.rebuildingakidney.org", "staging.rebuildingakidney.org", "dev.rebuildingakidney.org"], // array of host names
            config: {
                headTitle: "RBK/GUDMAP",
                navbarBrand: "/resources/"
            }
        }, {
            host: ["www.gudmap.org", "staging.gudmap.org", "dev.gudmap.org"], // array of host names
            config: {
                headTitle: "GUDMAP/RBK",
                navbarBrand: "/"
            }
        }
    ]
};

if (typeof module === 'object' && module.exports && typeof require === 'function') {
    exports.config = chaiseConfig;
}
