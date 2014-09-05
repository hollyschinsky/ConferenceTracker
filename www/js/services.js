angular.module('conference.services', ['ngResource'])
.service('favoriteSvc', [ '$rootScope', function( $rootScope ) {
    var service = {
      favorites: [],
      addFave: function ( item, successCallback, dupeCallback ) {
          // Only add if doesn't exist
          var session = filterById(service.favorites,item.id);
          if (session == null) {
              service.favorites.push(item);
              successCallback();
          }
          else dupeCallback();

          // Filter function to look for a dupe
          function filterById(faves, id) {
                return faves.filter(function(faves) {
                    return (faves['id'] == id);
                })[0];
          }
      }
   }
   return service;
}])

.factory('Session', function ($resource) {
    // Node backend
    return $resource('http://localhost:5000/sessions/:sessionId');
    // HS - Set locally to my network when running with Ionic serve...
    //return $resource('http://192.168.1.25:5000/sessions/:sessionId');
    //return $resource('data/sessions.json/:sessionId');
})

.service('ProfileSvc', [ '$rootScope', function( $rootScope ){
   var service = {
        getFBProfile: function(success,fail) {
            openFB.api({
                path: '/me',
                params: {fields: 'id,name,email'},
                success: function (user) {
                    $rootScope.$apply(function () {
                        $rootScope.user = user;
                    });
                    success();
                },
                error: function (error) {
                    var msg;
                    if (error.code = 190) {
                        msg = ' You must first login with Facebook for this feature.'
                    }

                    if (navigator.notification)
                        navigator.notification.alert('Facebook error ' + error.message + msg, null, 'Error')
                    else alert('Facebook error: ' + error.message + msg);
                    fail();
                }
            });
        }
    }
    return service;
}]);