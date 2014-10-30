---
layout: module
title: Module 14&#58;  Adding Toast-Style Notifications
---
![](images/app/native-toast.png)

1. Add the [toast plugin](https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin) to your project:

    ```
    $ ionic plugin add https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin
    
    ```

1. Add a function to handle displaying a *toast* message in the **AppCtrl** in controllers.js. The code will fall back on an ionic sort of hack to display a
similar type of toast message when testing in the browser. 

    ```
    function showToast(message) {
            if (window.plugins && window.plugins.toast) {
                window.plugins.toast.showShortCenter(message);
            }
            else $ionicLoading.show({ template: message, noBackdrop: true, duration: 2000 });
        }
    ```
    
    Now it can be called from where it's needed using:
    
    ```
    showToast($scope.msg);
    ```