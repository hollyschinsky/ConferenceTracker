angular.module('conference.controllers', ['conference.services'])

// General App Handler - no specific route specified - so it handles login methods invoked from menu by default
.controller('AppCtrl', function($scope, $ionicModal, $timeout, FacebookService, TwitterService, LinkedInService) {
    // Initialize our social services
    TwitterService.initialize();
    LinkedInService.initialize();

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
         $scope.loginMsg = "Please enter a username and password";
         $scope.login.result = false;
     }
    };

    $ionicModal.fromTemplateUrl('templates/msgModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.msgModal = modal;
    });


    // Facebook Login (actual Facebook login, have to use your FB credentials)
    $scope.fbLogin = function() {
        FacebookService.login(rspCallback);
        function rspCallback(response) {
            console.log("RESP " + response);
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
        // If Twitter Logged in
        if (TwitterService.isReady()) {
            //sign out clears the OAuth cache, the user will have to reauthenticate when returning
            TwitterService.clearCache();
            $scope.user = null;
            $scope.msg = "Twitter logout success"
        }
        else if (LinkedInService.isReady()) {
            //sign out clears the OAuth cache, the user will have to reauthenticate when returning
            LinkedInService.clearCache();
            $scope.user = null;
            $scope.msg = "Linkedin logout success"
        }
        // There's only one callback in the openFB logout()...
        else if (window.sessionStorage.fbtoken) {
          openFB.logout(function (msg) {
              $scope.user = null;
              $scope.msg = "Facebook logout success"
          })
        }
        else $scope.msg = "Logout success";

        $scope.msgModal.show();
    }
})

.controller('SessionsCtrl', function($scope, SessionService, $ionicPopover) {

    // Get all the sessions initially
    $scope.sessions = SessionService.query();

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
})

.controller('SessionCtrl', function($scope, $stateParams, $q, $ionicModal, $timeout, SessionService, FavoriteService,
                                    $cordovaDialogs, TwitterService, FacebookService) {

    $scope.favorites = FavoriteService.favorites;

    // Create the modal that we will need to display a message popupFa
    $ionicModal.fromTemplateUrl('templates/msgModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.msgModal = modal;
    });

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
        else $cordovaDialogs.alert('You must first login with Facebook to use this feature.',null,'Info');
    }

    $scope.follow = function(screenname) {
        if (TwitterService.isReady()) {
            TwitterService.follow(screenname).then(function (data) {
                console.log("Speaker has " + data.followers_count + " followers")
                $cordovaDialogs.alert('You are now following ' + screenname, null, 'Info');
            });
        }
        else {
            $cordovaDialogs.alert('You must first login with Twitter to use this feature.',null,'Info');
            TwitterService.connectTwitter().then(function () {
                $cordovaDialogs.alert('You are now following ' + screenname, null, 'Info');
            })
        }
    }

    $scope.addFavorite = function (item) {
        if (!item.isFave)
            FavoriteService.addFave(item,successCB,errorCB);
        else {
            item.isFave=false;
            FavoriteService.removeFave(item);
        }

        $timeout(function() {
            $scope.closeMsg();
        }, 1000);
    }
    function errorCB() {
        $scope.msg = 'Session was already added';
        $scope.showMsg();
    }
    function successCB(session) {
        $scope.msg = 'Session added to favorites';
        $scope.showMsg();
        session.isFave=true;
    }

    $scope.showMsg = function() {
        $scope.msgModal.show();
    };

    // Triggered in the fave modal to close it
    $scope.closeMsg = function() {
        $scope.msgModal.hide();
    };
})

// Let's use the Favorites Service to filter the list that we've marked...
.controller('FavoritesCtrl', function($scope, $cordovaDialogs, FavoriteService, FacebookService, TwitterService) {
    $scope.favorites = FavoriteService.favorites;
    $scope.showDelete = false;

    $scope.showBtn = function() {
        if ($scope.showDelete===false)
            $scope.showDelete=true
        else ($scope.showDelete=false)
    }
    $scope.share = function(fave) {
        if (window.sessionStorage.fbtoken!=undefined) {
            FacebookService.postFacebook(fave);
        }
        else $cordovaDialogs.alert('You must first login with Facebook to use this feature.',null,'Info');
    }

    $scope.follow = function(screenname) {
        if (TwitterService.isReady()) {
            TwitterService.follow(screenname).then(function (data) {
                console.log("Speaker has " + data.followers_count + " followers");
                $cordovaDialogs.alert('You are now following ' + screenname, null, 'Info');
            });
        }
        else {
            $cordovaDialogs.alert('You must first login with Twitter to use this feature.',null,'Info');
            TwitterService.connectTwitter();
        }
    }
})

.controller('ProfileCtrl', function($scope, FacebookService, $cordovaDialogs, TwitterService, LinkedInService) {
    $scope.user = {};

    // Try to get user info if null (user will be populated if logged into Facebook)
    if (TwitterService.isReady()){
        TwitterService.getProfile().then(function(data) {
            $scope.user.pic = data.avatar;
            $scope.user.name = data.name;
            $scope.user.email = data.alias; // use this for now - it's actually screenname
        })
    }
    else if (LinkedInService.isReady()) {
        //ProfileService.getLinkedInProfile(null,null);
        LinkedInService.getProfile().then(function(data) {
            $scope.user.pic = data.avatar;
            $scope.user.name = data.firstname + " " + data.lastname;
            $scope.user.email = data.email;
        })
    }
    else if (window.sessionStorage.fbtoken!=undefined) {
        FacebookService.getProfile(onSuccess, onFail);
        function onSuccess(user) {
            $scope.$apply(function () {
                $scope.user = user;
                $scope.user.pic = "http://graph.facebook.com/" + user.id + "/picture?height=100&type=normal&width=100";
            })
        }

        function onFail(error) {
            var msg = "Could not access Facebook for profile data: " + error.message;
            if (error.code == 190) // Not authorized
                msg = 'You must first login with Facebook for this feature.'

            if ($cordovaDialogs) $cordovaDialogs.alert(msg, null, 'Error');

            else alert(msg);
        }
    }
    else {
        // Some Default User Info
        $scope.user.name = "Anton Phillips";
        $scope.user.email = "anton.phillips@agilesystems.com";
        $scope.user.pic = "pics/default-user.jpg"
    }
})

