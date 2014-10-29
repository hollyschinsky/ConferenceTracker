PhoneGap Advanced Tutorial
===========================

In this tutorial you will learn how to build a PhoneGap app written with Ionic/AngularJS and using a REST API of Node/ExpressJS for the data consumption.

You will build is a conference/event application that allows you to view and search sessions and speakers and uses a variety of native plugins and provides many features including:

1. Native Sharing 
2. Native Calendar 
3. Toast Notifications
4. Status Bar Customization
5. Keyboard Customization
6. Device detection

- Sorting
- Filtering
- Side Menu
- OAuth.io for Twitter and LinkedIn
- Adding Favorites
- Facebook integration using a non-plugin approach
- Add to native calendar
- Share with native share system
- Using native notifications
- Modal
- Popover
- AngularJS Repeat





https://github.com/oauth-io/oauth-js
 

Setting up the Ionic App
-------------------------
1. Ensure you have [Ionic](http://ionicframework.com/getting-started/) installed (and are using latest version)

2. Create a new Ionic project

        ionic start ConferenceTracker

3. Replace the **/www** folder with the **/www** folder from this project.

4. Add the InAppBrowser plugin (needed for Facebook OAuth on device)
b
        cordova plugins add org.apache.cordova.inappbrowser

5. Add the dialogs plugin (for native style alert dialogs)

        cordova plugin add org.apache.cordova.dialogs

6. Add desired platforms (when ready to test on device)

        ionic platform add ios

7. Run on desired platform

        ionic run ios

**IMPORTANT NOTE:** Facebook integration for Login with Facebook and Profile menu option currently only works when running with the browser via [http://localhost:5000/#/app/sessions](http://localhost:5000/#/app/sessions) after setting up REST services below. It does not yet work via Ionic run/serve. Working on it.


Setting up the REST Services
----------------------------
** Copy the **/server** folder from this repo into the Ionic project root folder created above

1. Install server dependencies. Navigate into **/server** folder from the command line and type:

        npm install

2. Start the node server

        node server

3. Go to [http://localhost:5000/sessions](http://localhost:5000/sessions) to test your node service in your browser and make sure you see session data returned in JSON format.


Test the app in the browser with: [http://localhost:5000/#/app/sessions](http://localhost:5000/#/app/sessions)

** Login with your Facebook credentials from the Login screen if you want to see your profile info in the Profile menu option.