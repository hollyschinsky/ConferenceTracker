angular.module('conference.controllers', ['conference.services'])

// General App Handler - no specific route specified - so it handles login methods invoked from menu by default
.controller('AppCtrl', function($scope, $ionicModal, $timeout, ProfileSvc) {
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

  // Basic Login Handling -
  // Invoke a check for userid and pw being valued but nothing beyond a message
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
    openFB.login(
        function(response) {
            if (response.status === 'connected') {
                $scope.loginMsg="Facebook login succeeded!";
                $scope.login.result=true;
                $scope.closeLogin();
                if (window.location.href.indexOf('profile')>-1)
                    ProfileSvc.getFBProfile(function(user){$scope.user=user},function(error){console.log(error)});

            } else {
                $scope.loginMsg="Facebook login failed";
                $scope.login.result=false;
            }
        },
        {scope: 'email,publish_actions'});
    }

    // General Logout
    $scope.logout = function() {
      // There's only one callback in the openFB logout()...
      openFB.logout(function(msg) {
                $scope.user = null;
                if (msg==null)
                    msg = "Facebook logout success"

                $scope.msg = msg;
                $scope.msgModal.show();
        }
      )
    }
})

// Triggered from the sessions view... based on being specified in app.js route
.controller('SessionsCtrl', function($scope, SessionSvc, $ionicPopover) {
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

    // Get all sessions initially
    $scope.sessions = SessionSvc.query();

    $scope.setFilter = function() {
        console.log("Filter field " + this.field);

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
})

// Triggered from a specific session view... Session Detail
.controller('SessionCtrl', function($scope, $stateParams, $ionicModal, $timeout, SessionSvc, FavoriteSvc) {
    // Create the modal that we will need to display a message popup quick when things occur
    $ionicModal.fromTemplateUrl('templates/msgModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.msgModal = modal;
    });

    $scope.session = SessionSvc.get({sessionId: $stateParams.sessionId});
    $scope.favorites = FavoriteSvc.favorites;

    $scope.share = function(event) {
          openFB.api({
              method: 'POST',
              path: '/me/feed',
              params: {
                  message: "I'll be attending: '" + $scope.session.title + "' by " +
                      $scope.session.speaker
              },
              success: function () {
                  if (navigator.notification)
                      navigator.notification.alert('This session has been shared on Facebook',null,'Success')
                  else alert('This session has been shared on Facebook');
              },
              error: function (error) {
                  var msg = 'An error occurred while sharing this session on Facebook';
                  if (error.code == 190)
                      msg = ' You must first login with Facebook to use this feature.'

                  if (navigator.notification)
                    navigator.notification.alert(msg,null,'Error');
                  else alert(msg);
              }
          });
    }

    $scope.addFavorite = function (item) {
        // Show msg modal if added
        FavoriteSvc.addFave(item,successCB,errorCB);

        $timeout(function() {
            $scope.closeMsg();
        }, 1000);
    }
    function errorCB() {
        $scope.msg = 'Session was already added';
        $scope.showMsg();
    }
    function successCB() {
        $scope.msg = 'Session added to favorites'; //TODO: Do I care if it was already added? Make it a red heart or unreponsive?
        $scope.showMsg();
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
.controller('FavoritesCtrl', function($scope, FavoriteSvc) {
    $scope.favorites = FavoriteSvc.favorites;
})

// TODO: Add some basic profile data rather than depend on Facebook...
.controller('ProfileCtrl', function($scope, ProfileSvc) {
    // Try to get user info if null (user will be populated if logged into Facebook)
    if ($scope.user==null)
        getProfile();

    function getProfile() {
        ProfileSvc.getFBProfile(onSuccess,onFail);

        function onSuccess(user) {$scope.user = user;}

        function onFail(error) {
            var msg = "Could not access Facebook for profile data: " + error.message;
            // There's a dependency on the facebook login currently for the profile info so we'll let them know
            if (error.code == 190) // Not authorized
                msg = 'You must first login with Facebook for this feature.'

            if (navigator.notification)
                navigator.notification.alert(msg, null, 'Error')
            else alert(msg);
            //$scope.login(); we could force the login here with this line but commenting out for now...
        }
    }
})
