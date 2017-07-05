/**footer diretive: to create page footer
 * styleing is controoled dynamically based on scroll height. If these is scroll on the page then footer is 'relative'
 * else it is 'absolute'.
 * @example <footer></footer>
 */

(function() {
    'use strict';

    angular.module('chaise.footer', [])
        .directive('footer', ['ERMrest', '$timeout', function(ERMrest, $timeout) {

            return {
                restrict: 'E',
                scope: {},
                templateUrl: '../common/templates/footer.html',
                link: function(scope) {
                    var footerText = chaiseConfig.footerMarkdown;
                    angular.isUndefinedOrNull = function(val) {
                        return val == '' || angular.isUndefined(val) || val === null
                    }

                    function setClass() {
                        $timeout(function() {
                            scope.posStyle = {
                                width: 'auto',
                                height: '30px',
                                'background-color': '#ededed',
                                right: 0,
                                bottom: 0,
                                left: 0
                            };
                            if ($(document).height() > $(window).height()) { //scrolling
                                scope.posStyle.position = 'relative';
                            } else {
                                scope.posStyle.position = 'absolute';
                            }
                            if (angular.isUndefinedOrNull(footerText))
                                footerText = "**Default Privacy Policy.** [Privacy Policy](/privacy-policy/){target='_blank'}";

                            ERMrest._onload().then(function() {
                                scope.privacyResult = ERMrest.renderMarkdown(footerText);
                            })
                        }, 500);
                    }
                    setClass();
                    scope.$watch(function() {
                        return $(document).height();
                    }, function(o, n) {
                        setClass();
                    });
                }
            };
        }])
})();
