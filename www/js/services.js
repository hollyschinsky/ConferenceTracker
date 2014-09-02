angular.module('conference.services', ['ngResource'])
.service('favoriteSvc', [ '$rootScope', function( $rootScope ) {
    var service = {
      favorites: [],
      addFave: function ( item ) {
        if (service.favorites.indexOf(item)==-1)
          service.favorites.push( item );
        $rootScope.$broadcast( 'favorites.update' );
     }
   }

   return service;
}])

.factory('Session', function ($resource) {
    // Node backend
    return $resource('http://localhost:5000/sessions/:sessionId');
    //return $resource('data/sessions.json/:sessionId');
    //return $resource('data/sessions.json/:sessionId', {}, {
      //query: {method:'GET', isArray:true}
    //});
});
