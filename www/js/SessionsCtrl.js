/**
 * Created by hollyschinsky on 10/30/14.
 */
angular.module('conference.SessionsCtrl', ['conference.services'])
.controller('SessionsCtrl', function($scope, SessionService, $ionicPopover) {

    // Get all the sessions
    $scope.sessions = SessionService.query();

    // Filter sessions by entering text in field and selecting from drop-down
    $scope.setFilter = function() {
        var search = $scope.searchTxt;
        var field = this.field;

        if (field === 'title')
            $scope.search = {title:search};
        else if (field === 'speaker')
            $scope.search = {speaker:search};
        else if (field === 'description')
            $scope.search = {description:search};
        else $scope.search = {$:search}; // ALL cases
    }

    $scope.clear = function() {$scope.searchTxt=""};

    // About version popover handling
    $ionicPopover.fromTemplateUrl('templates/about-popover.html', {
        scope: $scope
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.showFilterPopover = function($event) {
        $scope.popover.show($event);
    };

    $scope.closePopover = function() {
        $scope.popover.hide();
    };

    // Cleanup the popover upon destroy event
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });
})
