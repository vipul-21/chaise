# Configuration File: chaise-config.js

**Chaise** uses a set of default configuration parameters. You can overwrite them through the `chaise-config.js` file and/or the search parameters in the URL.

A Chaise deployment includes a sample config file ([chaise-config-sample.js](https://github.com/informatics-isi-edu/chaise/blob/master/chaise-config-sample.js)) at the root directory that you can edit and then rename to `chaise-config.js`.

The below table explains the usage of the default parameters:

| Parameter | Values | Default Value | chaise-config.js | URL | Remarks |
|-----------|--------|---------------|------------------|-----|---------|
| catalog | A catalog id | 1 | "catalog":\<id\> | catalog=\<id\> | The catalog id has a numeric value |
| schema | A schema name | N/A | "schema":\<name\> | schema=\<name\> | A default value can be established through the [schema annotation default keys](/chaise/search/annotation.html#schema-annotations). <br> A random schema of the catalog is selected if it is not specified otherwise. |
| layout | list <br> table <br> card | list | "layout":\<value\> | layout=\<value\> | The view the summary page will be rendered. |
| facetPolicy | on_demand | N/A | "facetPolicy":\<value\> | N/A | If present with the _on_demand_ value, requests (for facets count and for facets distinct values) will be issued only for the selected facets. <br> At start up, the facets with the "top" annotation will be selected.<br>  On demand, you can check also other facets. |
| feedbackURL | A URL for a form to provide feedback. | None | "feedbackURL":\<URL\> | N/A | |
| helpURL | A URL for getting help using Chaise. | None | "helpURL":\<URL\> | N/A | |
| ermrestLocation | The base URL for the ERMrest service | window.location.protocol + // + window.location.host | "ermrestLocation": \<URL\> | N/A | The location of the ERMrest service. |
| recordResource | The sub path for the record resource | /record | "recordResource":\<value\> | N/A | |
| showBadgeCounts | true <br> false | false | "showBadgeCounts":\<value\> | N/A | If true, facet counts will be displayed in the sidebar. |
| tableThreshold | Number of rows. | 0 | "tableThreshold":\<value\> | N/A | Max number of rows default to transpose view. |
| showAllAttributes | A boolean | False | "showAllAttributes":\<value\> | N/A | If present and True, select all the attributes in the search page. |
| headTitle | An application name | Chaise | "headTitle":\<value\> | N/A | The application name. |
| customCSS | A URL | N/A | "customCSS":\<value\> | N/A | The URL for a style sheet file to be applied for the application header. This is typically a relative URL to a dedicated stylesheet in the CSS folder of the related static site repo (For example, in RBK, it's /assets/css/chaise.css in the rbk-www repo). More information can be found [here](custom-css.md) |
| navbarBrand | A URL | N/A | "navbarBrand":\<value\> | N/A | The URL for the branding logo in the top navigation bar. |
| navbarBrandText | A string | Chaise | "navbarBrandText":\<value\> | N/A | The value to be displayed in the navigation bar. |
| navbarBrandImage | A URL | N/A | "navbarBrandImage":\<value\> | N/A | The URL for an image to be displayed in the navigation bar. |
| logoutURL | A URL | / | "logoutURL":\<value\> | N/A | The URL to the logout page, root if not defined. |
| maxRecordsetRowHeight | A boolean/number | 160 | "maxRecordsetRowHeight":\<value\> | N/A | Set this property to false if you don't want content to be clipped in tables else set it to a number which represent the maximum row height when not expanded. |
| dataBrowser | A URL | /chaise/search | "dataBrowser":\<value\> | N/A | The URL to continue after a logout. |
| defaultAnnotationColor | red, orange, gold, green, blue, purple | red | "defaultAnnotationColor":\<value\> | N/A | In `/chaise/viewer`, annotations' borders and colors will default to this value. |
| confirmDelete | A boolean | true | "confirmDelete":\<value\> | N/A | If `false`, the user will **not** be prompted by a modal when deleting an item |
| hideSearchTextFacet | A boolean | false | "hideSearchTextFacet":\<value\> | N/A | Whether the search box for attributes names and values should be hidden |
| maxColumns | An integer | 6 | "maxColumns":\<value\> | N/A | The maximum number of columns to be displayed in the search result table |
| showUnfilteredResults | A boolean | false | "showUnfilteredResults":\<value\> | N/A | If present and equal **true**, data will be displayed in the search result table even if no filter was selected. |
| editRecord | A boolean | N/A | "editRecord":\<value\> | N/A | If not present or equal to **true**, the recordedit page allows for inserting records and editing records. The record page will have an edit button for both of these cases as well. If equal to **false**, a dialog appears on recordedit that disallows use of the app for both create and edit, and the create/edit button does not appear in the record app. |
| deleteRecord | A boolean | false | "deleteRecord":\<value\> | N/A | If present and equal to **true**, the recordedit page will show delete button if editRecord is also true, and record page will show delete button if this is true. Otherwise, hide delete buttons. |
| defaultCatalog | A catalog id | N/A | "defaultCatalog":\<id\> | N/A | The catalog id has a numeric value. Use this parameter to specify which catalog Chaise shows by default. |
| defaultTables | An object that specifies a catalog's the default schema and table | N/A | "defaultTables": {N: {"schema": S, "table": T}, ...} | N/A | Use this parameter to specify for each catalog `N`, which table `T` Chaise shows by default. |
| signUpURL | A URL | N/A | "signUpURL":\<your_URL\> | N/A | Use this parameter to specify what the "Sign Up" link in the navbar should link to. If `signUpURL` is unspecified, the navbar will not display a "Sign Up" link. |
| profileURL | A URL | N/A | "profileURL":\<your_URL\> | N/A | When a user is logged in, the navbar displays the user's username. Use this parameter to specify what the username in the navbar should link to (e.g. `https://www.globus.org/app/account` if your deployment uses Globus authentication). If `profileURL` is unspecified, the navbar will display the username as regular text. |
| navbarMenu | An object | N/A | "navbarMenu":\{...\} | N/A | Use this parameter to customize the menu items displayed in the navbar at the top of all Chaise apps by supplying an object with your links and/or dropdown menus. The `url` property of each menu object allows for templating of the catalog id parameter using handlebars. Consult the _chaise-config.js_ file for more details about format. |
| sidebarPosition | "left" <br> "right" | "right" | "sidebarPosition": \<value\> | N/A | Applies to the Search app only. If \<value\> is "left", the sidebar will be on the left and the main content will shift left correspondingly. If \<value\> is "right", the sidebar will be on the right. |
| attributesSidebarHeading | String | "Choose Attributes" | "attributesSidebarHeading": \<value\> | N/A | Applies to Search app only. Use this parameter to customize the heading displayed in at the top of the Attributes sidebar (usually the first sidebar that appears when the Search app loads). |
| userGroups | An object | N/A | "userGroups" : {"curators": <group id>, "annotators": <group id>, "curators": <group id>} | N/A | For Viewer app only. The Viewer app assigns an authenticated user one of three permission levels depending on the user's Globus memberships. The permission levels, from highest to lowest, are `curator`, `annotator`, `user`. The default Globus group IDs that determine who's a `curator`, `annotator`, or `user` are set by [RBK](https://github.com/informatics-isi-edu/rbk-project). To override these default group IDs for each permission level, you may specify your own via this `userGroups` setting.
| allowErrorDismissal | Boolean | false | "allowErrorDismissal" : \<value\> | N/A | All terminal error message display an error message dialog that is not dismissable by default. Set this property to true if you want to allow dismissable error message dialogs.
| searchPageSize | Integer | 25 | "searchPageSize" : \<value\> | N/A | If present, its value represents the number of records to be displayed on a page in the search view.
| footerMarkdown | A footer markdown string | N/A | "footerMarkdown" : \<value\> | N/A | If present, it creates a footer at the bottom of the app with the markdown text.
| maxRelatedTablesOpen | Integer | N/A | "maxRelatedTablesOpen" : \<value\> | N/A | It defines maximum number of expanded related table on a page during initial loading. If related tables exceed this value then all of them shall be collapsed.
| showFaceting | Boolean | false | "showFaceting" : \<value\> | N/A | If true, shows the faceting panel on the recordset app.
| hideTableOfContents | Boolean | false | "hideTableOfContents" : \<value\> | N/A | If true, hides the table of contents panel on the record app. By default table of contents will be visible.
| showExportButton | Boolean | false | "showExportButton" : \<value\> | N/A | If true, shows the experimental export button.
| chaiseBasePath | A URL | "/chaise/" | "chaiseBasePath" : \<value\> | N/A | The path of chaise deployment directory. It is used when accessing Chaise modules from outside of Chaise App.
| resolverImplicitCatalog | Integer | N/A | "resolverImplicitCatalog" : \<value\> | N/A | Set to a catalog number, N, if your resolver accepts `/id/X` instead of `/id/N/X` and you prefer to share records with this shorter URL. If the property is `null`, the resolver functionality will be turned off and the default permalink will be used. Anything else will be ignored and the default behavior will be applied which is to always use the catalog-qualified form, `/id/N/X`.
| disableDefaultExport | Boolean | false | "disableDefaultExport" : \<value\> | N/A | When the export annotation is missing from table and schema, ermrestjs will use the heuristics to generate a default export template. Set this attribute to `true` to avoid using the heuristics.
| exportServicePath | String | "/deriva/export/" | "exportServicePath" : \<value\> | N/A | You can use this variable to switch between different export services that might be available in the deployment.
| assetDownloadPolicyURL | String | N/A | "assetDownloadPolicyURL" : \<value\> | N/A | Set this property to the url that points to the download policy for when an asset is fetched but the user is unauthorized to fetch that asset.
| includeCanonicalTag | Boolean | false | "includeCanonicalTag" : \<value\> | N/A | This variable can be used to force chaise to include a <link> tag in the <head> tag that defines the canonical link for each of the entities and other resource pages.
| configRules | Array | N/A | "configRules" : [{host: \<value\> \| [\<value\>, ...], config: {}},...] | N/A | Allows for host specific configuration rules. Each object in the array contains 2 properties, `host` and `config`. `Host` is expected to be in the format of a single `string` value or an array of `string` values. `Config` mimics the `chaise-config` properties. All chaise config properties can be defined in this block except this property (`configRules`).
