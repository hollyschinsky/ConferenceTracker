angular.module('conference.services', ['ngResource'])
.factory('SessionSvc', function ($resource) {
    // Node backend - works when running on emulator, browser and with PhoneGap Dev App
    return $resource('http://localhost:5000/sessions/:sessionId');

    // When testing directly on device using $ionic run, need to use the URL to your network
    // such as below
     //$resource('http://192.168.1.25:5000/sessions/:sessionId');
    //return $resource('data/sessions.json/:sessionId');
})
.service('FavoriteSvc', [ '$rootScope', function( $rootScope ) {
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

.service('ProfileSvc', [ '$rootScope', function( $rootScope ){
   var service = {
        getFBProfile: function(success,fail) {
            openFB.api({
                path: '/me',
                params: {fields: 'id,name,email'},
                success: function (user) {
                    $rootScope.$apply(function () {
                        $rootScope.user = user;
                        success(user);
                    });
                },
                error: function (error) {
                    fail(error);
                }
            });
        }
    }
    return service;
}]);