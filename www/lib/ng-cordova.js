
angular.module('ngCordova', [
  'ngCordova.plugins'
]);


angular.module('ngCordova.plugins', [
	 'device',
	 'dialog',
	 'facebookConnect',
	 'keyboard',
	 'localNotification',
	 'push',
	 'statusbar',
	 'toast'
]);

//#### Begin Individual Plugin Code####

// install   :     cordova plugin add org.apache.cordova.device
// link      :     https://github.com/apache/cordova-plugin-device/blob/master/doc/index.md

angular.module('ngCordova.plugins.device', [])

  .factory('$cordovaDevice', [function () {

    return {
      getDevice: function () {
        return device;
      },

      getCordova: function () {
        return device.cordova;
      },

      getModel: function () {
        return device.model;
      },

      // Warning: device.name is deprecated as of version 2.3.0. Use device.model instead.
      getName: function () {
        return device.name;
      },

      getPlatform: function () {
        return device.platform;
      },

      getUUID: function () {
        return device.uuid;
      },

      getVersion: function () {
        return device.version;
      }
    }
  }]);
// install   :     cordova plugin add org.apache.cordova.dialogs
// link      :     https://github.com/apache/cordova-plugin-dialogs/blob/master/doc/index.md

angular.module('ngCordova.plugins.dialogs', [])

  .factory('$cordovaDialogs', ['$q', function ($q) {

    return {
      alert: function (message, title, buttonName) {
        var d = $q.defer();

        navigator.notification.alert(message, function () {
          d.resolve();
        }, title, buttonName);

        return d.promise;
      },

      confirm: function (message, title, buttonLabels) {
        var d = $q.defer();

        navigator.notification.confirm(message, function () {
          d.resolve();
        }, title, buttonLabels);

        return d.promise;
      },

      prompt: function (message, title, buttonLabels, defaultText) {
        var d = $q.defer();

        navigator.notification.confirm(message, function () {
          d.resolve();
        }, title, buttonLabels, defaultText);

        return d.promise;
      },

      beep: function (times) {
        return navigator.notification.beep(times);
      }
    };
  }]);
// install   :
// link      :

'use strict';
angular.module('ngCordova.plugins.facebookConnect', [])
  .provider('$cordova', [

    function () {
      this.FacebookAppId = undefined;

      this.setFacebookAppId = function (id) {
        this.FacebookAppId = id;
      };

      this.$get = [
        function () {
          var FbAppId = this.FacebookAppId;
          return {
            getFacebookAppId: function () {
              return FbAppId;
            }
          };
        }];
    }
  ])
  .factory('$cordovaFacebookConnect', ['$q', '$cordova', function ($q, $cordova) {

    return {
      init: function (appId) {
        if (!window.cordova) {
          facebookConnectPlugin.browserInit(appId);
        }
      },

      login: function (o) {
        this.init($cordova.getFacebookAppId());

        var q = $q.defer();
        facebookConnectPlugin.login(o,
          function (res) {
            q.resolve(res);
          }, function (res) {
            q.reject(res);
          });

        return q.promise;
      },

      showDialog: function (o) {

        var q = $q.defer();
        facebookConnectPlugin.showDialog(o,
          function (res) {
            q.resolve(res);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;
      },

      api: function (path, permission) {

        var q = $q.defer();
        facebookConnectPlugin.api(path, permission,
          function (res) {
            q.resolve(res);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;
      },

      getAccessToken: function () {
        var q = $q.defer();
        facebookConnectPlugin.getAccessToken(function (res) {
            q.resolve(res);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;
      },

      getLoginStatus: function () {
        var q = $q.defer();
        facebookConnectPlugin.getLoginStatus(function (res) {
            q.resolve(res);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;

      },

      logout: function () {
        var q = $q.defer();
        facebookConnectPlugin.logout(function (res) {
            q.resolve(res);
          },
          function (err) {
            q.reject(err);
          });

        return q.promise;

      }
    };
  }]);
// install   :      cordova plugin add https://github.com/driftyco/ionic-plugins-keyboard.git
// link      :      https://github.com/driftyco/ionic-plugins-keyboard

//TODO: add support for native.keyboardshow + native.keyboardhide

angular.module('ngCordova.plugins.keyboard', [])

  .factory('$cordovaKeyboard', [function () {

    return {
      hideAccessoryBar: function (bool) {
        return cordova.plugins.Keyboard.hideKeyboardAccessoryBar(bool);
      },

      close: function () {
        return cordova.plugins.Keyboard.close();
      },

      disableScroll: function (bool) {
        return cordova.plugins.Keyboard.disableScroll(bool);
      },

      isVisible: function () {
        return cordova.plugins.Keyboard.isVisible
      }
    }
  }]);
// install   :
// link      :

angular.module('ngCordova.plugins.localNotification', [])

  .factory('$cordovaLocalNotification', ['$q',
    function ($q) {

      return {
        add: function (options, scope) {
          var q = $q.defer();
          window.plugin.notification.local.add(
            options,
            function (result) {
              q.resolve(result);
            },
            scope);
          return q.promise;
        },

        cancel: function (id, scope) {
          var q = $q.defer();
          window.plugin.notification.local.cancel(
            id, function (result) {
              q.resolve(result);
            }, scope);

          return q.promise;
        },

        cancelAll: function (scope) {
          var q = $q.defer();

          window.plugin.notification.local.cancelAll(
            function (result) {
              q.resolve(result);
            }, scope);

          return q.promise;
        },

        isScheduled: function (id, scope) {
          var q = $q.defer();

          window.plugin.notification.local.isScheduled(
            id,
            function (result) {
              q.resolve(result);
            }, scope);

          return q.promise;
        },

        getScheduledIds: function (scope) {
          var q = $q.defer();

          window.plugin.notification.local.getScheduledIds(
            function (result) {
              q.resolve(result);
            }, scope);

          return q.promise;
        },

        isTriggered: function (id, scope) {
          var q = $q.defer();

          window.plugin.notification.local.isTriggered(
            id, function (result) {
              q.resolve(result);
            }, scope);

          return q.promise;
        },

        getTriggeredIds: function (scope) {
          var q = $q.defer();

          window.plugin.notification.local.getTriggeredIds(
            function (result) {
              q.resolve(result);
            }, scope);

          return q.promise;
        },

        getDefaults: function () {
          return window.plugin.notification.local.getDefaults();
        },

        setDefaults: function (Object) {
          window.plugin.notification.local.setDefaults(Object);
        },

        onadd: function () {
          return window.plugin.notification.local.onadd;
        },

        ontrigger: function () {
          return window.plugin.notification.local.ontrigger;
        },

        onclick: function () {
          return window.plugin.notification.local.onclick;
        },

        oncancel: function () {
          return window.plugin.notification.local.oncancel;
        }
      }
    }
  ]);// install   :      cordova plugin add https://github.com/phonegap-build/PushPlugin.git
// link      :      https://github.com/phonegap-build/PushPlugin

angular.module('ngCordova.plugins.push', [])

  .factory('$cordovaPush', ['$q', function ($q) {
    return {
      register: function (config) {
        var q = $q.defer();
        window.plugins.pushNotification.register(
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          config);

        return q.promise;
      },

      unregister: function (options) {
        var q = $q.defer();
        window.plugins.pushNotification.unregister(
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          options);

        return q.promise;
      },

      // iOS only
      setBadgeNumber: function (number) {
        var q = $q.defer();
        window.plugins.pushNotification.setApplicationIconBadgeNumber(
          function (result) {
            q.resolve(result);
          },
          function (error) {
            q.reject(error);
          },
          number);
        return q.promise;
      }
    };
  }]);// install   :      cordova plugin add org.apache.cordova.statusbar
// link      :      https://github.com/apache/cordova-plugin-statusbar/blob/master/doc/index.md

angular.module('ngCordova.plugins.statusbar', [])

  .factory('$cordovaStatusbar', [function () {

    return {
      overlaysWebView: function (bool) {
        return StatusBar.overlaysWebView(true);
      },

      // styles: Default, LightContent, BlackTranslucent, BlackOpaque
      style: function (style) {
        switch (style) {
          case 0:     // Default
            return StatusBar.styleDefault();

          case 1:     // LightContent
            return StatusBar.styleLightContent();

          case 2:     // BlackTranslucent
            return StatusBar.styleBlackTranslucent();

          case 3:     // BlackOpaque
            return StatusBar.styleBlackOpaque();

          default:  // Default
            return StatusBar.styleDefault();
        }
      },


      // supported names: black, darkGray, lightGray, white, gray, red, green, blue, cyan, yellow, magenta, orange, purple, brown
      styleColor: function (color) {
        return StatusBar.backgroundColorByName(color);
      },

      styleHex: function (colorHex) {
        return StatusBar.backgroundColorByHexString(colorHex);
      },

      hide: function () {
        return StatusBar.hide();
      },

      show: function () {
        return StatusBar.show()
      },

      isVisible: function () {
        return StatusBar.isVisible();
      }
    }
  }]);
// install   :      cordova plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin.git
// link      :      https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin

angular.module('ngCordova.plugins.toast', [])

  .factory('$cordovaToast', ['$q', function ($q) {

    return {
      showShortTop: function (message) {
        var q = $q.defer();
        window.plugins.toast.showShortTop(message, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      },

      showShortCenter: function (message) {
        var q = $q.defer();
        window.plugins.toast.showShortCenter(message, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      },

      showShortBottom: function (message) {
        var q = $q.defer();
        window.plugins.toast.showShortBottom(message, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      },

      showLongTop: function (message) {
        var q = $q.defer();
        window.plugins.toast.showLongTop(message, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      },

      showLongCenter: function (message) {
        var q = $q.defer();
        window.plugins.toast.showLongCenter(message, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      },

      showLongBottom: function (message) {
        var q = $q.defer();
        window.plugins.toast.showLongBottom(message, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      },


      show: function (message, duration, position) {
        var q = $q.defer();
        window.plugins.toast.show(message, duration, position, function (response) {
          q.resolve(response);
        }, function (error) {
          q.reject(error)
        });
        return q.promise;
      }
    }

  }]);