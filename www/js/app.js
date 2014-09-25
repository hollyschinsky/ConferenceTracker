// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires' 'conference.controllers' is found in controllers.js
//var app = angular.module('conference', ['ionic', 'conference.controllers', 'ngCordova.plugins.device',
  //  'ngCordova.plugins.keyboard','ngCordova.plugins.statusbar', 'ngCordova.plugins.dialogs'])
var app = angular.module('conference', ['ionic', 'conference.controllers', 'ngCordovaMocks'])

    .run(function($ionicPlatform) {
        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if(window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
            }
            if(window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
    })

.config(function($stateProvider, $urlRouterProvider) {
  //Facebook integration - Register your app and get your App ID from http://developer.facebook.com
  openFB.init({appId: '443262072480898'});

  $stateProvider
    .state('app.profile', {
      url: "/profile",
      views: {
          'menuContent' :{
              templateUrl: "templates/profile.html",
              controller: "ProfileCtrl"
          }
      }
    })

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppCtrl'
    })

    .state('app.search', {
      url: "/search",
      views: {
        'menuContent' :{
          templateUrl: "templates/search.html"
        }
      }
    })

    .state('app.favorites', {
      url: "/favorites",
      views: {
        'menuContent' :{
          templateUrl: "templates/favorites.html",
          controller: "FavoritesCtrl"
        }
      }
    })

    .state('app.sessions', {
      url: "/sessions",
      views: {
          'menuContent': {
              templateUrl: "templates/sessions.html",
              controller: 'SessionsCtrl'
          }
      }
    })

    .state('app.twitter', {
      url: "/twitter",
      views: {
          'menuContent': {
              templateUrl: "templates/twitter.html",
              controller: 'TwitterController'
          }
      }
    })

    .state('app.session', {
      url: "/sessions/:sessionId",
      views: {
          'menuContent': {
              templateUrl: "templates/session.html",
              controller: 'SessionCtrl'
          }
      }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/sessions');
});
