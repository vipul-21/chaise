(function() {
    'use strict';

    angular.module('chaise.recordeditcols', [])

        .directive('recordeditCols', ['DataUtils','$timeout', function(DataUtils, $timeout) {
            return {
                restrict: 'E',
                transclude: true,
                scope: {
                    columns: '=',
                    values: '=',
                    recordTableModel: '=',
                    relatedReferenceDisplayTable: '=',
                    toggleRelatedTableDisplayType: '&',
                    canEditRelated: '&',
                    canCreateRelated: '&',
                    addRelatedRecord: '&',
                    toRecordSet: '&',
                    showEmptyRelatedTables: '='
                },
                templateUrl: '../common/templates/record.html',
                controller: function($scope) {
                    $scope.makeSafeIdAttr = DataUtils.makeSafeIdAttr;
                },
                link: function(scope){

                    scope.isInline = function (i) {
                        var column = scope.columns[i];
                        return (column.isInboundForeignKey || (column.isPathColumn && column.hasPath && !column.isUnique));
                    };

                    // returns true if we should show the column
                    scope.showColumn = function (i) {
                        return (typeof scope.values[i].value === "string" && scope.values[i].value !== '') && !scope.isInline(i);
                    };

                    // returns true if we should show a table
                    scope.showInlineTable = function (i) {
                        return scope.isInline(i) && (scope.showEmptyRelatedTables || (scope.recordTableModel[i] && scope.recordTableModel[i].rowValues.length > 0));
                    };
                }
            };
        }])

})();
