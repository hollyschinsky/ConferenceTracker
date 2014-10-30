/**
 * Created by hollyschinsky on 9/21/14.
 */
/**
 * Created by hollyschinsky on 9/11/14.
 */
app.factory('LinkedInService', function($q) {

    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('your-public-key');

            // try to create an authorization result when the page loads so the user won't
            // have to click the twitter button again
            authorizationResult = OAuth.create('linkedin');
        },
        isReady: function() {
            return (authorizationResult);
        },
        connectLinkedin: function() {
            var deferred = $q.defer();
            OAuth.popup('linkedin', function(error, result) {
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else console.log("An error occurred while connecting to linkedin " + error);
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache('linkedin');
            authorizationResult = false;
        },
        getProfile: function() {
            var deferred = $q.defer();
            var promise = authorizationResult.me().done(function(data) {
                deferred.resolve(data)
            });
            return deferred.promise;
        }
    }

});