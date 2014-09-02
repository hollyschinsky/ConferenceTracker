ConferenceTracker
=================

Sample PhoneGap conference application. Built with Ionic/AngularJS and using Node/Express for REST services


Setting up the Ionic App
-------------------------
1. Ensure you have [Ionic](http://ionicframework.com/getting-started/) installed (and are using latest version)

2. Create a new Ionic project

        ionic start ConferenceTracker
        
3. Replace the **/www** folder with the **/www** folder from this project. 

4. Add the InAppBrowser plugin (needed for Facebook OAuth on device)

        cordova plugins add org.apache.cordova.inappbrowser

5. Add desired platforms (when ready to test on device)
        
        ionic platform add ios

6. Run on desired platform

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
