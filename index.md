---
layout: home
title: PhoneGap Advanced Tutorial - Building a PhoneGap App with Ionic/AngularJS+NodeJS+ExpressJS
---

## What you will build
In this tutorial you will learn everything you need to take a hybrid application from scratch to app store lesson by lesson.
This tutorial builds upon the previous [Beginning PhoneGap Workshop](hollyschinsky.github.io/phonegap-workshop/) where we built a basic 
Conference application using no particular MVC framework. In this advanced version we will build an app using a more opinionated approach 
with Cordova/Ionic/AngularJS and a Node/ExpressJS REST API backend data service.

![](images/app/app-overview.jpg)

Throughout this tutorial you will be advised on how to handle different challenges and learn many useful tips. This app implements the 
following features that you will learn to add in the following lessons: 

## App Features 
1. **Side Menu** - Side menu navigation with icons
2. **Custom Status Bar** - Set the font and icons to white to match the title bar text
3. **Custom Keyboard Accessory Bar** - keep accessory bar for drop-down options on sort
4. **Login with Facebook, LinkedIn or Twitter** - in addition to a custom login option using OAuth
5. **Profile** - display the user's profile based on the social media logged in with
6. **Facebook integration** - using a non-plugin approach
7. **Add to native calendar** - easily add a session to your native calendar with all session details
8. **Favorites Management** - add to favorites / remove from favorites by tapping heart again or via the Favorites menu option list manager
9. **Swipe to share from list**
10. **Share with native sharing system on device**
11. **Uses native notifications/dialogs**
12. **Toast-style alerts**
13. **Modal login panel upon open**
14. **Popover 'About' screen**
15. **Sort options** - sort sessions by different criteria
16. **Filter/Search** - Search all data with a search term
17. **Handling offline**
17. **Numerous AngularJS directives and patterns used including:**
    -routing
    -repeat
    -ngSwitch
    -ngShow
    -ngHide
    -ngClass
    -ngClick    
 
## Plugins
The following plugins will be added along the way to help provide the above features:

1. [Social Share Plugin](https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin/) 
2. [Calendar Plugin](https://github.com/EddyVerbruggen/Calendar-PhoneGap-Plugin.git)
3. [Toast Notification Plugin](https://github.com/EddyVerbruggen/Toast-PhoneGap-Plugin)
4. [Status Bar Plugin](https://github.com/apache/cordova-plugin-statusbar)
5. [Keyboard Plugin](https://github.com/driftyco/ionic-plugins-keyboard)
6. [Device Plugin](https://github.com/apache/cordova-plugin-device)
7. [InAppBrowser/OAuth](https://github.com/oauth-io/oauth-phonegap) - for social media OAuth support 
8. [Console Plugin](https://github.com/apache/cordova-plugin-console)
9. [NetworkInformation/Connection Plugin](https://github.com/apache/cordova-plugin-network-information)
10. [OAuth Plugin](https://github.com/oauth-io/oauth-phonegap)

## Other Skills You Will Learn
1. Setting icons and splash screens
2. Debugging with Safari, Weinre and more
3. Testing with the PhoneGap Developer App
4. App Store Submission Tips
5. Using Google font libraries
6. How to setup OAuth.io with your social media accounts

>The plugin details will be covered along the way. Take a look at the [Official Cordova Plugin Registry](http://plugins.cordova.io) here to explore further as well. 

## Requirements

- To complete this workshop, all you need is a code editor, a modern browser, and a connection to the Internet.

- A working knowledge of HTML and JavaScript is assumed, but you don't need to be a JavaScript guru.

>A mobile device or a Mobile SDK is **not** a requirement for this tutorial. You will able to test your application in the browser or with the PhoneGap Developer App with some limitations. If you want the full support of the native APIs then you will need the mobile SDK for that platform (iOS SDK, Android SDK, etc.) installed on your system. 


## Issues

- Please create an issue [here](https://github.com/hollyschinsky/ConferenceTracker/issues) if you run
into any problem or have a suggestion to improve this workshop.

- You can also use the *Comments* section at the bottom of each lesson to ask a question or report a problem.

- You could also contact me on Twitter:

    <a href="https://twitter.com/devgirlfl" class="twitter-follow-button" data-show-count="true" 
    data-size="large" data-lang="en">Follow 
    @devgirlfl</a>
    <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="//platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>

## Credit

- This tutorial also builds upon the basic [Ionic Tutorial](ccoenraets.github.io/ionic-tutorial) built by [Christophe Coenraets](http://coenraets.org). 

## Disclaimer!!! 
- This tutorial is still a work in progress and modules continuing to be written though [the GitHub project has the entire app](https://github.com/hollyschinsky/ConferenceTracker) and code to support the features mentioned above. Please continue, please continue to check
 back for more explanation of how each feature was implemented specifically as I'm working on adding the details asap.   

<div class="row" style="margin-top:40px;">
<div class="col-sm-12">
<a href="install-ionic.html" class="btn btn-default pull-right">Next <i class="glyphicon
glyphicon-chevron-right"></i></a>
</div>
</div>
