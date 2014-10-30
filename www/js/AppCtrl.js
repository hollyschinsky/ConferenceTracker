angular.module('conference.AppCtrl', ['conference.services'])
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