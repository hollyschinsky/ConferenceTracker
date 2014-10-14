Setup Instructions
==================

Running from the PhoneGap Developer App 
---------------------------------------
Via $ phonegap serve

1) Go into /server folder and start node server with:

    $ node server

    Express server listening on port 5000
    
2) The facebook login/logout will work whether the lib/openFB.js file has the URLs hard coded to the localhost URL or
whether it is determined automatically.



Running directly on device or emulator from command line  
---------------------------------------------------------
$ ionic run ios or from XCode

1) Go into /server folder and start node local node server with:

    $ node server

    Express server listening on port 5000
    
    
2) The facebook login/logout will *NOT* work unless the lib/openFB.js file has the URLs hard coded to the localhost URL
because it cannot use the file:/// protocol that is set when it is determined automatically.
        
        
Running in browser 
-------------------
$ ionic serve

** Works with hard coded URL for Facebook and localhost:5000 - (runs in browser URL under http://192.168.1.25:8100/#/app/profile)

1) Go into /server folder and start node local node server with:

    $ node server

    Express server listening on port 5000
    
    
2) The facebook login/logout will not work unless the lib/openFB.js file has the URLs hard coded to the localhost URL
because it cannot use the file:/// protocol that is set when it is determined automatically.
