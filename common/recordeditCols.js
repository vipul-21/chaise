(function() {
    'use strict';

    angular.module('chaise.recordeditcols', [])

        .directive('recordeditCols', ['DataUtils','$timeout', function(DataUtils, $timeout) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    form: "=",
                    column: '=',
                    rowIndex: '=',
                    row: '='
                },
                templateUrl: '../common/templates/recordeditCols.html',
                controller: function($scope) {
                    // $scope.makeSafeIdAttr = DataUtils.makeSafeIdAttr;
                }
            };
        }])

})();
