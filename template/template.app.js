(function () {
    'use strict';

    angular.module('chaise.template', [
        'chaise.authen',
        'chaise.errors',
        'chaise.footer',
        'chaise.html',
        'chaise.modal',
        'chaise.navbar',
        'chaise.utils',
        'ermrestjs',
        'ngSanitize'
    ])

    //  Enable log system, if in debug mode
    .config(['$logProvider', function($logProvider) {
        $logProvider.debugEnabled(chaiseConfig.debug === true);
    }])

    // Register the 'context' object which can be accessed by config and other
    // services.
    .constant('context', {
        appName:'template'
    })

    .run(['AlertsService', 'context', 'FunctionUtils', 'headInjector', 'MathUtils', 'messageMap', '$rootScope', 'Session', 'UriUtils', '$window',
        function (AlertsService, context, FunctionUtils, headInjector, MathUtils, messageMap, $rootScope, Session, UriUtils, $window) {

            // set up the headers (add custom css, etc.)
            headInjector.setupHead();

            // set the value of window.location.origin
            UriUtils.setOrigin();

            $rootScope.context = context;
            context.pageId = MathUtils.uuid();

            $rootScope.alerts = AlertsService.alerts;

            // register the callbacks that ermrestjs needs
            FunctionUtils.registerErmrestCallbacks();

            $rootScope.loading = true;

            // Subscribe to on change event for session
            var subId = Session.subscribeOnChange(function() {

                // Unsubscribe onchange event to avoid this function getting called again
                Session.unsubscribeOnChange(subId);

                var ermrestUri = UriUtils.chaiseURItoErmrestURI($window.location);
                var headers = {
                    cid: context.appName,
                    pid: context.pageId,
                    wid: $window.name
                };
                ERMrest.resolve(ermrestUri, headers).then(function getReference(reference) {
                    var session = Session.getSessionValue();

                    if (!session && Session.showPreviousSessionAlert()) {
                        AlertsService.addAlert(messageMap.previousSession.message, 'warning', Session.createPromptExpirationToken);
                    }

                    $rootScope.reference = reference.contextualize.compact;
                    $rootScope.reference.session = session;

                    $rootScope.tableDisplayName = $rootScope.reference.displayname;
                    $rootScope.tableComment = $rootScope.reference.table.common;

                    var location = reference.location;
                    $rootScope.pageLimit = 25;
                    if (location.queryParams.limit) {
                        $rootScope.pageLimit = parseInt(location.queryParams.limit);
                    } else if ($rootScope.reference.display.defaultPageSize) {
                        $rootScope.pageLimit = $rootScope.reference.display.defaultPageSize;
                    }

                    return $rootScope.reference.read($rootScope.pageLimit);
                }).then(function (page) {
                    $rootScope.loading = false;
                    $rootScope.page = page;
                }).catch(function (err) {
                    throw err;
                });
            });
        }
    ]);
})();
