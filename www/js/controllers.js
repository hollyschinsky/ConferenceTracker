angular.module('conference.controllers', ['conference.services'])

// General App Handler - no specific route specified - so it handles login methods invoked from menu by default
.controller('AppCtrl', function($scope, $ionicModal, $ionicLoading, $timeout, FacebookService, TwitterService, LinkedInService) {
    console.log("App ctrl initialize");

    // Init the login modal
    $scope.loginData = {};
    $scope.loginMsg="";

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope
    })
    .then(function(modal) {
        $scope.modal = modal;
        // Now that modal is ready, let's have them login first
        $scope.login();
    });

    $scope.closeLogin = function() {
        $scope.modal.hide();
    };

    // Open the login modal
    $scope.login = function() {
        $scope.loginData = {};
        $scope.loginMsg="";
        if ($scope.modal!=undefined)
            $scope.modal.show();
    };

    // Basic Login Handling - invoke a check for userid and pw being valued but nothing beyond a message
    $scope.doLogin = function() {
     if ($scope.loginData.username!=undefined && $scope.loginData.password!=undefined) {
         // Simulate authentication check - roll your own here instead of success timeout :)
         $timeout(function() {
             $scope.closeLogin();
         }, 1000);
         $scope.loginMsg = "Login successful!";
         $scope.login.result = true;
     }
     else {
         $scope.loginMsg = "Please enter a valid username and password.";
         $scope.login.result = false;
     }
    };

    // Facebook Login (actual Facebook login, have to use your FB credentials)
    $scope.fbLogin = function() {
        FacebookService.login(rspCallback);
        function rspCallback(response) {
            if (response.status === 'connected') {
                $scope.loginMsg = "Facebook login succeeded!";
                $scope.login.result = true;
                $scope.closeLogin();
                // Could add code to check if on profile page and swap out user with logged in one...
            } else {
                $scope.loginMsg="Facebook login failed";
                $scope.login.result=false;
            }
        }
    }

    // Twitter Login
    $scope.twLogin = function() {
        //TwitterService.initialize();
        TwitterService.connectTwitter().then(function () {
            if (TwitterService.isReady()) {
                $scope.loginMsg="Twitter login succeeded!";
                $scope.login.result=true;
                $scope.closeLogin();
            }
        });
    }

     // LinkedIn Login
    $scope.liLogin = function(event) {
        LinkedInService.initialize();
        LinkedInService.connectLinkedin().then(function () {
            if (LinkedInService.isReady()) {
                $scope.loginMsg="LinkedIn login succeeded!";
                $scope.login.result=true;
                $scope.closeLogin();
            }
        });
    }

    // Logout
    $scope.logout = function() {
        var fbConnected = false;
        FacebookService.getStatus(function (result) {
            if (result.status == 'connected')
                fbConnected = true;
        })

        // If Twitter Logged in
        if (TwitterService.isReady()) {
            //sign out clears the OAuth cache, the user will have to reauthenticate when returning
            TwitterService.clearCache();
            $scope.user = null;
            $scope.msg = "Twitter logout success!"
        }

        else if (LinkedInService.isReady()) {
            //sign out clears the OAuth cache, the user will have to reauthenticate when returning
            LinkedInService.clearCache();
            $scope.user = null;
            $scope.msg = "LinkedIn logout success!"
        }

        else if (fbConnected) {
            FacebookService.logout(function(rsp){
                $scope.user = null;
                $scope.msg = "Facebook logout success!"
            })
        }

        else {
            $scope.msg = "Logout success!";
        }
        showToast($scope.msg);

    }

    function showToast(message) {
        if (window.plugins && window.plugins.toast) {
            window.plugins.toast.showShortCenter(message);
        }
        else $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    }
})

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

// Uses the Favorites Service to filter the list that we've marked...
.controller('FavoritesCtrl', function($scope, $ionicLoading, FavoriteService, FacebookService, TwitterService) {
    $scope.favorites = FavoriteService.favorites;
    $scope.showDelete = false;

    $scope.showBtn = function() {
        if ($scope.showDelete===false)
            $scope.showDelete=true
        else ($scope.showDelete=false)
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

    $scope.follow = function(screenname) {
        if (TwitterService.isReady()) {
            TwitterService.follow(screenname).then(function (data) {
                console.log("Speaker has " + data.followers_count + " followers");
                showToast('You are now following ' + screenname + ' (total number of followers '+ data.followers_count+')');
            });
        }
        else alert('You must first login with Twitter to use this feature.');
    }

    function showToast(message) {
        if (window.plugins && window.plugins.toast) {
            window.plugins.toast.showShortCenter(message);
        }
        else $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
    }
})

.controller('ProfileCtrl', function($scope, FacebookService, TwitterService, LinkedInService) {
    $scope.user = {};
    var fbConnected=false;

    FacebookService.getStatus(function (result) {
        if (result.status == 'connected')
            fbConnected=true;
    })

    if (fbConnected) {
        FacebookService.getProfile(function (user) {
            $scope.user = user;
            $scope.user.pic = "http://graph.facebook.com/" + user.id + "/picture?height=100&type=normal&width=100";
        }, null);
    }
    else if (TwitterService.isReady()) {
        TwitterService.getProfile().then(function (data) {
            $scope.user.pic = data.avatar;
            $scope.user.name = data.name;
            $scope.user.email = data.alias; // use this for now - it's actually screenname
        })
    }
    else if (LinkedInService.isReady()) {
        LinkedInService.getProfile().then(function (data) {
            $scope.user.pic = data.avatar;
            $scope.user.name = data.firstname + " " + data.lastname;
            $scope.user.email = data.email;
        })
    }
    else {
        // Some Default User Info
        $scope.user.name = "Ryan Phillips";
        $scope.user.email = "ryan.phillips@agilesystems.com";
        $scope.user.pic = "pics/default-user.jpg"
    }
})

