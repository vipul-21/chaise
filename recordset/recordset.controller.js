(function() {
    'use strict';

    angular.module('chaise.recordset')

    // Register the recordset controller
    .controller('recordsetController', ['ConfigUtils', 'DataUtils', 'messageMap', 'recordsetModel', 'Session', 'UiUtils', 'UriUtils', '$document', '$log', '$rootScope', '$scope', '$timeout', '$window',
        function(ConfigUtils, DataUtils, messageMap, recordsetModel, Session, UiUtils, UriUtils, $document, $log, $rootScope, $scope, $timeout, $window) {

        var ctrl = this;
        var chaiseConfig = ConfigUtils.getConfigJSON();
        $scope.vm = recordsetModel;

        $scope.makeSafeIdAttr = DataUtils.makeSafeIdAttr;

        recordsetModel.RECORDEDIT_MAX_ROWS = 200;
        ctrl.showExportButton = (chaiseConfig.showExportButton === true);
        $scope.navbarBrand = (chaiseConfig.navbarBrand !== undefined ?  chaiseConfig.navbarBrand : "");
        $scope.navbarBrandImage = (chaiseConfig.navbarBrandImage !== undefined ? chaiseConfig.navbarBrandImage : "");
        $scope.navbarBrandText = (chaiseConfig.navbarBrandText !== undefined ? chaiseConfig.navbarBrandText : "Chaise");
        var mainBodyEl;
        $scope.tooltip = messageMap.tooltip;

        function updateLocation() {
            $window.scrollTo(0, 0);
            $window.location.replace($scope.permalink());
            $rootScope.location = $window.location.href;
        }

        $rootScope.$on('reference-modified', function() {
            updateLocation();
        });

        $scope.permalink = function() {

            // before run, use window location
            if (!recordsetModel.reference) {
                return $window.location.href;
            }

            //TODO we could use the reference.appLink instead of this
            var url = UriUtils.chaiseBaseURL() + "/recordset/#" + recordsetModel.reference.location.catalog + "/" +
                recordsetModel.reference.location.compactPath;

            // add sort modifier
            if (recordsetModel.reference.location.sort)
                url = url + recordsetModel.reference.location.sort;

            // add paging modifier
            if (recordsetModel.reference.location.paging)
                url = url + recordsetModel.reference.location.paging;

            // add ermrestjs supported queryParams
            if (recordsetModel.reference.location.queryParamsString) {
                url = url + "?" + recordsetModel.reference.location.queryParamsString;
            }

            return url;
        };

        $scope.edit = function() {
            var link = recordsetModel.page.reference.contextualize.entryEdit.appLink;
            // TODO ermrestJS needs to handle the case when no limit is defined in the URL
            if (link.indexOf("?limit=") === -1 || link.indexOf("&limit=") === -1)
                link = link + (link.indexOf('?') === -1 ? "?limit=" : "&limit=" ) + recordsetModel.pageLimit;

            return link;
        };

        $scope.create = function() {
            // TODO: Generate a unique id for this request
            // append it to the URL
            // var referrer_id = 'recordset-' + MathUtils.getRandomInt(0, Number.MAX_SAFE_INTEGER);
            // addRecordRequests[referrer_id] = 0;

            // open a new tab
            var newRef = recordsetModel.reference.unfilteredReference.contextualize.entryCreate;
            var appLink = newRef.appLink;
            // appLink = appLink + (appLink.indexOf("?") === -1 ? "?" : "&") + 'invalidate=' + UriUtils.fixedEncodeURIComponent(referrer_id);

            return appLink;
        };

        $scope.versionDisplay = function () {
            return UiUtils.humanizeTimestamp(recordsetModel.reference.location.versionAsMillis);
        }

        $scope.versionDate = function () {
            return UiUtils.versionDate(recordsetModel.reference.location.versionAsMillis);
        }

        /*** Container Heights and other styling ***/
        // fetches the height of navbar, bookmark container, and view
        // also fetches the main container for defining the dynamic height
        function fetchMainElements() {
            var elements = {};
            try {
                // get document height
                elements.docHeight = $document[0].documentElement.offsetHeight
                // get navbar height
                elements.navbarHeight = $document[0].getElementById('mainnav').offsetHeight;
                // get bookmark container height
                elements.bookmarkHeight = $document[0].getElementById('bookmark-container').offsetHeight;
                // get recordset main container
                elements.container = $document[0].getElementsByClassName("recordset-container")[0].getElementsByClassName('main-container')[0];
            } catch (error) {
                $log.warn(error);
            }
            return elements;
        }

        // fetches the height of navbar, bookmark container, and view
        // also fetches the faceting container for defining the dynamic height
        function fetchFacetingElements() {
            var elements = {};
            try {
                // get document height
                elements.docHeight = $document[0].documentElement.offsetHeight;
                // get navbar height
                elements.navbarHeight = $document[0].getElementById('mainnav').offsetHeight;
                // get bookmark container height
                elements.bookmarkHeight = $document[0].getElementById('bookmark-container').offsetHeight;
                // get recordset main container
                elements.container = $document[0].getElementsByClassName('faceting-container')[0];
            } catch (error) {
                $log.warn(error);
            }
            return elements;
        }

        function setRecordsetHeight() {
            var elements = fetchMainElements();
            // if these 2 values are not set yet, don't set the height
            if (elements.navbarHeight && elements.bookmarkHeight) {
                UiUtils.setDisplayContainerHeight(elements);
                // no need to fetch and verify the faceting elements (navbar and bookmark are the same container as the ones used in main elements function)
                if (chaiseConfig.showFaceting) UiUtils.setDisplayContainerHeight(fetchFacetingElements());
            }
        }

        // set the recordset height when it's loaded or we have the facets
        $scope.$watch(function() {
            return (recordsetModel.hasLoaded && recordsetModel.initialized) || (recordsetModel.config.showFaceting && recordsetModel.reference);
        }, function (newValue, oldValue) {
            if (newValue) {
                $timeout(setRecordsetHeight, 0);
            }
        });

        // watch for the main body size to change
        $scope.$watch(function() {
            if (mainBodyEl && mainBodyEl[0]) {
                return mainBodyEl && mainBodyEl[0].offsetHeight;
            }
        }, function (newValue, oldValue) {
            if (newValue) {
                $timeout(function () {
                    UiUtils.setFooterStyle(0);
                }, 0);
            }
        });


        angular.element($window).bind('resize', function(){
            if (recordsetModel.hasLoaded && recordsetModel.initialized ) {
                setRecordsetHeight();
                UiUtils.setFooterStyle(0);
                $scope.$digest();
            }
        });

        $timeout(function () {
            mainBodyEl = $document[0].getElementsByClassName('main-body');
        }, 0);
    }]);
})();
