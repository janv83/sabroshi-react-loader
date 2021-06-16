import React, {useEffect, useState} from 'react';

function SabroshiLoader(props) {
    let [runLoaded, setRunLoaded] = useState(false);
    let sabroshiAvatar = props.sabroshiAvatar;//useParams();
    console.log("sl loaded " + sabroshiAvatar);
 
    useEffect(() => {
   
   
    
    if(sabroshiAvatar || window.localStorage.sabroshiAvatar)  // user has requested that his avatar should be displayed in your app
    {
        if(sabroshiAvatar && sabroshiAvatar !== "disconnect")  
        {
            window.localStorage.sabroshiAvatar = sabroshiAvatar;  //saving the avatarlocation of the user in localstorage
        
                    console.log("about to add scripts");  

                //loading of the webversion of the bsv and run-sdk library
        const script =  document.createElement('script');
        script.type="text/javascript";
        script.src = "https://bico.media/2ae5137168cb00d204becebe83bc54af863392bcbc3f0da0340363aa263c6ed1.js";
        script.async = "true";
        script.addEventListener('load',()=>{ console.log("bsvloaded");
        
        const script2 = document.createElement('script');
        script2.type="text/javascript";
        script2.src = "https://bico.media/7429a95bf9f7d1b9bebd05031f7bd32aa2f00e97e01271ec182294f1cdb65642.js";
        script2.async = "true";
        script2.addEventListener('load',()=>{console.log("runloaded"); initRun(props.width, props.height, true).then(()=>{setRunLoaded(true)}); });

        document.body.appendChild(script2);

       });

        document.body.appendChild(script);

        
        }
        else
        {
                if(sabroshiAvatar === "disconnect")
                {
                    window.localStorage.removeItem("sabroshiAvatar");
                    window.localStorage.removeItem("sabroshiDataURL");
                    window.localStorage.sabroshiDisconnect = true;  //setting disconnect so Apps can  handle cleanup
                }
                
        }
    }
    

 
    }


      , []); 
    
    return (<div id="sabroshiContainer"></div>);
}


async function initRun(width, height, client)
{
    console.log("scripts added");
    const run = new Run({network: "main", trust: "*"});
    const cacheRun =new Run.plugins.RunConnect();
    run.cache = cacheRun;
    run.client = client;
    try{
    let ava = await loadAvatar(run, window.localStorage.sabroshiAvatar);
    if(ava && ava.owner === ava.activeSabroshi.owner)
    {
    let imgTag = new Image();
    imgTag.src="data:image/png;base64," + ava.activeSabroshi.metadata.image.base64Data;
    window.localStorage.sabroshiDataURL = imgTag.src; //sets the image data to be used elsewhere in localstorage
    imgTag.className ="sabroshiPicture";
    if(widht && height)
    {
    imgTag.width = width;
    imgTag.heigh = height;
    }
    document.getElementById("sabroshiContainer").append(imgTag);
    }
    else
    {
        console.log("sabroshi is not the same owner as sabroshiAvatar, setting of new Sabroshi is neeeded");
    }
    }
    catch(err)
    {
        console.log("rune error " + err.message);
        if(err.message.includes("ClientModeError"))
        {
            await initRun(width, height, false);
        }
    }

}



async function loadAvatar(runInstance, avatarLoc)
{
    runInstance.activate();
    console.log("about to load avatar");
    let ava = await runInstance.load(avatarLoc);
    await ava.sync({inner: false});
    console.log("avaloaded: " + ava.location);
    window.localStorage.sabroshiAvatar = ava.location;  //updating local storage to last known avatar location for faster sync times
    return ava;
}

export default SabroshiLoader;