# sabroshi-react-loader
handles request from users to have their SabroshiAvatar displayed, loads and displays their profile image, saves imagedata and avatarlocation to local storage.


npm install sabroshi-react-loader


let SabroshiLoader = require('sabroshi-react-loader').default;


<SabroshiLoader width={32} height={32} />


width and height are optional.


If the user requested to have his Avatar displayed (using getParamter sabroshiAvatar),
the following localStorage entries are created:

-sabroshiAvatar  (the avatar run location)
-sabroshiDataURL  (img data of the pic that should be displayed, can be used as src of img tags or saved into the db entry of your user where appropiate)

if the user decides to no longer want to have his avatar displaye, he sents sabroshiAvatar=disconnect, 
the SabroshiLoader deletes the localStorage entries and adds an entry sabroshiDisconnect = true instead.

If the user reconnects again, the sabroshiDisconnect variable is set to false.