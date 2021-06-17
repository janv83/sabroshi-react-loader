# sabroshi-react-loader
handles request from users to have their SabroshiAvatar displayed, loads and displays their profile image, saves imagedata and avatarlocation to local storage.  

## Install

```bash
npm install sabroshi-react-loader
```

## Usage
```jsx
import React from 'react'

let SabroshiLoader = require('sabroshi-react-loader').default;

function Example() {
  return(
    <div className="exampleContent">
        <SabroshiLoader width={32} height={32} />
    </div>
    )
}
export default Example;

```

width and height are optional.  
Edit the css with:
the created html has a container div with the id="sabroshiContainer"
and the img added has className="sabroshiPicture"  


If the user requested to have his Avatar displayed (using getParamter sabroshiAvatar),  
the following localStorage entries are created:  

-sabroshiAvatar  (the avatar run location)  
-sabroshiDataURL  (img data of the pic that should be displayed, can be used as src of img tags or saved into the db entry of your user where appropiate)  

if the user decides to no longer want to have his avatar displaye, he sents sabroshiAvatar=disconnect,   
the SabroshiLoader deletes the localStorage entries and adds an entry sabroshiDisconnect = true instead.  

If the user reconnects again, the sabroshiDisconnect variable is set to false.  


## License

MIT © [janv83](https://github.com/janv83)  