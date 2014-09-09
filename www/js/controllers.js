angular.module('conference.controllers', ['conference.services'])

.controller('ProfileCtrl', function($scope, ProfileSvc) {
    if ($scope.user==null)
        getProfile(); //Call immediately when open if haven't retrieved user info yet

    function getProfile() {
         ProfileSvc.getFBProfile(onSuccess,onFail);
         function onSuccess(user) {
             $scope.user = user;
         }
         function onFail() {
            // Give them the login modal so they can try to login from here and then load the user
            $scope.modal.show();
         }
     }
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $rootScope) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
      if (navigator.notification)
          navigator.notification.alert('Basic login succeeded, no facebook features enabled.',null,'Success')
      else alert('Basic login succeeded, no facebook features enabled.');
  };

  $scope.fbLogin = function() {
    openFB.login(
        function(response) {
            if (response.status === 'connected') {
                console.log('Facebook login succeeded');
                if (navigator.notification) {
                    navigator.notification.alert('Facebook login succeeded', null, 'Success');
                }
                else alert("Facebook login succeeded");
                $scope.closeLogin();
                //if we're on the profile page, set the user data with what was returned from FB so it displays now
                if (window.location.href.indexOf('profile')>-1)
                    $scope.user = $rootScope.user;

            } else {
                if (navigator.notification)
                    navigator.notification.alert('Facebook login failed',null,'Error')
                else alert('Facebook login failed');
            }
        },
        {scope: 'email,publish_actions'});
    }
    $scope.logout = function() {
      openFB.logout(
            function() {
                if (navigator.notification)
                    navigator.notification.alert('Logout successful',null,'Success')
                else alert('Logout successful');

                $scope.user = null;
            },
            function(error) {
                if (navigator.notification)
                    navigator.notification.alert('Logout error',null,'Error')
                else alert('Logout error ' + error);
            }
      )
    }
})

.controller('SessionsCtrl', function($scope, Session, $ionicPopover) {
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
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.popover.remove();
    });

    $scope.clear = function () {
        $scope.search = "";
        $scope.sessions = Session.query();
    }

    $scope.searchAll = function () {
        $scope.sessions = Session.query({name: $scope.searchKey});
    }
    $scope.sessions = Session.query();

    $scope.setFilter = function() {
        console.log("Filter " + this.field);

        var search = $scope.searchTxt;
        var field = this.field;
        if (field === 'title')
            $scope.search = {title:search};
        else if (field === 'speaker')
            $scope.search = {speaker:search};
        else if (field === 'description')
            $scope.search = {description:search};
        else $scope.search = {$:search}; // ALL case

        console.log("Sessions len " + $scope.sessions.length);
    }
})

.controller('SessionCtrl', function($scope, $stateParams, Session, favoriteSvc, $ionicModal, $timeout) {
    // If we want to go back to straight JSON file and not REST, we may need this...
    // $scope.sessions = Session.query();
    // sessionId = $stateParams.sessionId;
    // function filterById(sessions, id) {
    //   return sessions.filter(function(sessions) {
    //     return (sessions['id'] == id);
    //   })[0];
    // }
    // $scope.session = filterById($scope.sessions,sessionId);

    // Create the fave modal that we will use later
    $ionicModal.fromTemplateUrl('templates/faveModal.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.faveModal = modal;
    });

    $scope.session = Session.get({sessionId: $stateParams.sessionId});
    $scope.favorites = favoriteSvc.favorites;

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
                      navigator.notification.alert('The session was shared on Facebook',null,'Success')
                  else alert('The session was shared on Facebook');
              },
              error: function () {
                  if (navigator.notification)
                    navigator.notification.alert('An error occurred while sharing this session on Facebook',null,'Error');
                  else alert('An error occurred while sharing this session on Facebook');
              }
          });
    }
    $scope.addFavorite = function (item) {
        // Show msg modal if added
        favoriteSvc.addFave(item,successCB,errorCB);

        $timeout(function() {
          $scope.closeFaveMsg();
        }, 1000);
    }
    function errorCB() {
        $scope.faveMsg = 'Session was already added';
        $scope.showFaveMsg();
    }
    function successCB() {
        $scope.faveMsg = 'Session added to favorites';
        $scope.showFaveMsg();
    }

    $scope.showFaveMsg = function() {
        $scope.faveModal.show();
    };

    // Triggered in the fave modal to close it
    $scope.closeFaveMsg = function() {
      $scope.faveModal.hide();
    };
})

.controller('FavoritesCtrl', function($scope, favoriteSvc) {
  $scope.favorites = favoriteSvc.favorites;
});
