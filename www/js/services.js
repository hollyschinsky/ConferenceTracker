angular.module('conference.services', ['ngResource'])

.factory('SessionService', function ($resource) {
    // Node backend - works when running on emulator, browser and with PhoneGap Dev App
    //return $resource('http://localhost:5000/sessions/:sessionId');

    // When testing directly on device using ios run, need to use the URL to your network such as below
    return $resource('http://192.168.1.5:5000/sessions/:sessionId');
})

.service('FavoriteService', ['$filter', function($filter) {
    var service = {
        favorites: [],
        addFave: function ( item, successCallback, dupeCallback ) {
            // Only add if doesn't exist
            var session = filterById(service.favorites,item.id);
            if (session == null) {
                service.favorites.push(item);
                successCallback(item);
            }
            else dupeCallback();

            // Filter function to look for a dupe
            function filterById(faves, id) {
                return faves.filter(function(faves) {
                    return (faves['id'] == id);
                })[0];
            }
        },
        removeFave: function (item) {
            //service.favorites.splice(service.favorites.indexOf(item),1);
            var obj = $filter('filter')(service.favorites, function (fave) {
                console.log("Fave id " + fave.id)
                return fave.id === item.id;})[0];
            service.favorites.splice(service.favorites.indexOf(obj),1);
        }
    }
    return service;
}])
