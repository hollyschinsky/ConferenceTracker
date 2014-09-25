/**
 * Created by hollyschinsky on 9/25/14.
 */

app.service('FacebookService', function() {
    this.login = function(rspCallback) {
        openFB.login(
            function(response) {
                responseCB(response);
            },
            { scope: 'email,publish_actions' }//Specifies the set of Facebook permissions requested
        )
        responseCB = function (response) {
            rspCallback(response);  // calls back to controller method passed in
        }
    }

    this.logout = function(rspCallback) {
        openFB.logout(
            function(response) {
                responseCB(response);
            }
        )
        responseCB = function (response) {
            rspCallback(response);  // calls back to controller method passed in
        }
    }


    this.postFacebook = function (session, $cordovaDialogs) {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: "I'll be attending: '" + session.title + "' by " + session.speaker
            },
            success: function () {
                if ($cordovaDialogs)
                    $cordovaDialogs.alert('This session has been shared on Facebook',null,'Success');

                else alert('This session has been shared on Facebook');
            },
            error: function (error) {
                var msg = 'An error occurred while sharing this session on Facebook';
                if (error.code == 190)
                    msg = ' You must first login with Facebook to use this feature.'
                if ($cordovaDialogs)
                    $cordovaDialogs.alert(msg,null,'Error');
                else alert(msg);
            }
        });
    }

    this.getProfile = function(successCB,failCB) {
        openFB.api({
            path: '/me',
            params: {fields: 'id,name,email'},
            success: function (user) {
                //$rootScope.$apply(function () {
                //$rootScope.user = user;
                success(user);
                //});
            },
            error: function (error) {
                fail(error);
            }
        });
        success = function (user) {
            successCB(user);  // calls back to controller method passed in with user object
        },
        fail = function (error) {
            failCB(error);
        }
    }
})