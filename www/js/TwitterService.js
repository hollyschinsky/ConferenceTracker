/**
 * Created by hollyschinsky on 9/11/14.
 */
app.factory('TwitterService', function($q,$cordovaDialogs) {

    var authorizationResult = false;

    return {
        initialize: function() {
            //initialize OAuth.io with public key of the application
            OAuth.initialize('Isxt9U4oFguZVUDsGCddTYpwp6A');
            // try to create an authorization result when the page loads so the user won't
            // have to click the twitter button again
            authorizationResult = OAuth.create('twitter');

        },
        isReady: function() {
            return (authorizationResult);
        },
        connectTwitter: function() {
            var deferred = $q.defer();
            //cache means to execute the callback if the tokens are already present
            OAuth.popup('twitter', function(error, result) {
                if (!error) {
                    authorizationResult = result;
                    deferred.resolve();
                } else $cordovaDialogs.alert("An error occurred while connecting to twitter " + error,null,'Error');

            });
            return deferred.promise;
        },
        getProfile: function() {
            var deferred = $q.defer();
            var promise = authorizationResult.me().done(function(data) {
                deferred.resolve(data)
            });
            return deferred.promise;
        },
        clearCache: function() {
            OAuth.clearCache('twitter');
            authorizationResult = false;
        },
        getLatestTweets: function () {
            var deferred = $q.defer();
            // Using URL is https://dev.twitter.com/docs/api/1.1/get/statuses/home_timeline
            var promise = authorizationResult.get('/1.1/statuses/home_timeline.json').done(function(data) {
                deferred.resolve(data)
            });
            return deferred.promise;
        },
        follow: function (screenname) {
            var deferred = $q.defer();
            // Using URL https://api.twitter.com/1.1/friendships/create.json?user_id=1401881&follow=true
            var promise = authorizationResult.post('/1.1/friendships/create.json?screen_name='+screenname+'&follow=true').done(function(data) {
                deferred.resolve(data)
            });
            return deferred.promise;
        }

    }

});