/**
 * Created by hollyschinsky on 10/30/14.
 */
angular.module('conference.SessionCtrl', ['conference.services'])
.controller('SessionCtrl', function($scope, $stateParams, $q, $ionicLoading, $timeout, SessionService, FavoriteService,
                                    TwitterService, FacebookService) {

    $scope.favorites = FavoriteService.favorites;

    // When we get the session resource back, check to see if it matches any in the favorites and set a flag so the
    // heart displays red.
    SessionService.get({sessionId: $stateParams.sessionId})
        .$promise.then(function(session) {
            $scope.session = session;
            angular.forEach($scope.favorites, function (fave) {
                if (session.id == fave.id)
                    $scope.session.isFave = true;
            })
        });

    $scope.share = function(session) {
        if (window.sessionStorage.fbtoken!=undefined) {
            FacebookService.postFacebook(session);
        }
        else alert('You must first login with Facebook to use this feature.');
    }

    $scope.follow = function() {
        var screenname = $scope.session.twitter_id;
        if (TwitterService.isReady()) {
            TwitterService.follow(screenname).then(function (data) {
                console.log("Speaker has " + data.followers_count + " followers")
                showToast('You are now following ' + screenname + " (current follower count " + data.followers_count + ")");
            });
        }
        else alert('You must first login with Twitter to use this feature.');
    }

    $scope.addFavorite = function() {
        var currentSession = $scope.session;
        if (!currentSession.isFave)
            FavoriteService.addFave(currentSession,successCB,errorCB);
        else {
            currentSession.isFave=false;
            FavoriteService.removeFave(currentSession);
        }
    }
    function errorCB() { showToast('Session was already added.') }
    function successCB(session) {showToast('Session added to favorites!'); session.isFave=true; }

    function showToast(message) {
        if (window.plugins && window.plugins.toast) {
            window.plugins.toast.showShortCenter(message);
        }
        else $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    }

    $scope.addToCalendar = function() {
        if (window.plugins && window.plugins.calendar) {
            var hour = $scope.session.time.substring(0,$scope.session.time.indexOf(':'));
            if ($scope.session.time.indexOf("pm")>-1)
                hour = parseInt(hour)+12;
            var today = new Date();
            console.log("Date year" + today.getFullYear() + " mo " + today.getMonth()+ " day " + today.getDate());
            var startDate = new Date(today.getFullYear(),today.getMonth(),today.getDate(),hour,00,00);
            var endDate = new Date();
            endDate.setTime(startDate.getTime() + 3600000);//one hour

            window.plugins.calendar.createEvent($scope.session.title, $scope.session.room, $scope.session.description, startDate, endDate,
                function () {
                    alert($scope.session.title + " has been added to your calendar.");
                },
                function (error) {
                    console.log("Calendar fail " + error);
                });
        }
        else console.log("Calendar plugin not available.");
    }

    $scope.shareNative = function() {
        if (window.plugins && window.plugins.socialsharing) {
            window.plugins.socialsharing.share("I'll be attending the session: " + $scope.session.title + ".",
                'PhoneGap Day 2014', null, "http://pgday.phonegap.com/us2014",
                function() {
                    console.log("Success")
                },
                function (error) {
                    console.log("Share fail " + error)
                });
        }
        else console.log("Share plugin not available");
    }
})
