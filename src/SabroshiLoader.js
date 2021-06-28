import React, {useEffect, useState} from 'react';

function SabroshiLoader(props) {
    let [runLoaded, setRunLoaded] = useState(false);
    let sabroshiAvatar = props.sabroshiAvatar;
    
    
    useEffect(() => {
   
        
        sabroshiAvatar = getQueryVariable("sabroshiAvatar");
        let display = props.display;
        if(props.display === null || props.display === "" || typeof props.display === "undefined")
        {
            display = true;
        }
        if(!sabroshiAvatar)
            sabroshiAvatar = props.sabroshiAvatar;

        if(sabroshiAvatar === "disconnect")
        {
            window.localStorage.removeItem("sabroshiAvatar");
            window.localStorage.removeItem("sabroshiDataURL");
            window.localStorage.removeItem('sabroshiName');
            window.localStorage.removeItem('sabroshiBio');
            window.localStorage.sabroshiDisconnect = true;  //setting disconnect so Apps can  handle cleanup
        }
        else
        {
            if(sabroshiAvatar || window.localStorage.sabroshiAvatar)  // user has requested that his avatar should be displayed in your app
            {
                if(sabroshiAvatar)  
                {
                    window.localStorage.sabroshiAvatar = sabroshiAvatar;  //saving the avatarlocation of the user in localstorage
                    window.localStorage.sabroshiDisconnect = false;
                }
               
        
                        //loading of the webversion of the bsv and run-sdk library
                        const script =  document.createElement('script');
                        script.type="text/javascript";
                        script.src = "https://bico.media/2ae5137168cb00d204becebe83bc54af863392bcbc3f0da0340363aa263c6ed1.js";
                        script.async = "true";
                        script.addEventListener('load',()=>{ 
                            console.log("bsvloaded");
                        
                            const script2 = document.createElement('script');
                            script2.type="text/javascript";
                            script2.src = "https://bico.media/7429a95bf9f7d1b9bebd05031f7bd32aa2f00e97e01271ec182294f1cdb65642.js";
                            script2.async = "true";
                            script2.addEventListener('load',()=>{console.log("runloaded"); initRun(props.width, props.height, false, display).then(()=>{setRunLoaded(true)}); });
                
                            document.body.appendChild(script2);
                
                        });
                
                        document.body.appendChild(script);
                
            }
        }
    
    
    

 
    }, []); 
    
    return (<div id="sabroshiContainer"></div>);
}


function getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
        console.log(query)//"app=article&act=news_content&aid=160990"
        var vars = query.split("&");
        console.log(vars) //[ 'app=article', 'act=news_content', 'aid=160990' ]
        for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    console.log(pair)//[ 'app', 'article' ][ 'act', 'news_content' ][ 'aid', '160990' ] 
        if(pair[0] == variable){return pair[1];}
         }
         return(false);
}


async function initRun(width, height, client, display)
{
    const run = new Run({network: "main", trust: "*"});
    const cacheRun =new Run.plugins.RunConnect();


  
    run.cache = cacheRun;
    run.client = client;

    class SabroshiAvatar extends Jig {
        init(owner, name, mySabroshi, bio) {
    
            if((typeof owner) !== "string")
              throw new Error("invalid owner type");
            if((typeof name) !== "string")
              throw new Error("invalid name type");
              if((typeof bio) !== "string")
              throw new Error("invalid bio type");
            
            expect(mySabroshi).toBeInstanceOf(Sabroshi);
            
    
            this.sender = caller && caller.owner ? caller.owner:null;
    
            if(mySabroshi.owner !== owner)
                throw new Error("you don't own this sabroshi");
    
            this.owner = owner;
            this.name = name;
            this.bio = bio;
            this.activeSabroshi = mySabroshi;
            this.metadata = {name:this.name, symbol: "AVA", author: this.owner}; 
    
        }
    
        changeName(name)
        {
          if((typeof name) !== "string")
          throw new Error("invalid name type");
          this.name = name;
          this.metadata.name = this.name;
        }
    
        changeSabroshi(newSabroshi)
        {
            expect(newSabroshi).toBeInstanceOf(Sabroshi);
            if(newSabroshi.owner !== this.owner)
                throw new Error("you don't own this Sabroshi");   
            this.activeSabroshi = newSabroshi;
        }
        static addFriend(friend)
        {
            if(!this.friends)
            {
                this.friends = [];
            }
            this.friends.push(friend);
            
        }
        static setFriends(friends)
        {
            this.friends = friends;
        }
    }
    
    
    class Sabroshi extends Jig
    {
        init(series, minRarity)
        {
            expect(caller).toBeInstanceOf(Pack);
            this.owner = caller.owner;
            this.bropheus = new Bropheus(series, minRarity);
            this.valueSet = false;
            this.series = series;
        }
    
       /* setValues()
        {
            if(this.bropheus.nonce > 1 &&  !this.valueSet)
            {
                this.gender = this.bropheus.gender;
                this.brow = this.bropheus.brow; 
                this.complexion = this.bropheus.complexion;
                this.eyes = this.bropheus.complexion;
                this.hair = this.bropheus.hair;
                this.hat = this.bropheus.hat;
                this.mask = this.bropheus.mask;
                this.mouth = this.bropheus.mouth;
                this.node = this.bropheus.nose;
                this.valueSet = true;
                this.bropheus = null;
            }
            else
            {
                if(!this.valuesSet)
                    console.log("bropheus is still eating cookies with the oracle");
                else
                    console.log("rerolling attributes not possible");
            }
        }*/
        send(to)
        {
          this.sender = this.owner;
          this.owner = to;
        }
    
        static addFriend(friend)
        {
            if(!this.friends)
            {
                this.friends = [];
            }
            
            
            this.friends.push(friend);
            
        }
    
        static setFriends(friends)
        {
            this.friends = friends;
        }
    }
    
    
    
    class Pack extends Jig
    {
        init(series, numberOfSabroshis, guaranteedRareness, numberOfRareSabroshis)
        {
            this.series = series;
            this.owner = "18VYxvRrcdMAjsKbhiTuQyCd1ozSiLnN4e";
            this.numberOfSabroshis = numberOfSabroshis;
            this.guaranteedRareness = guaranteedRareness;
            this.numberOfRareSabroshis = numberOfRareSabroshis;
        }
    
        openPack()
        {
            let packArr = [];
            for(var i = 0; i< (this.numberOfSabroshis-this.numberOfRareSabroshis); i++)
            {
                let s = new Sabroshi(this.series, null);
                packArr.push(s);
            }
            //create the guaranteed rare one
            for(var i = 0; i < this.numberOfRareSabroshis; i++)
            {
                let sRare = new Sabroshi(this.series, this.guaranteedRareness);
                packArr.push(sRare);
            }
            this.destroy();
            return packArr;
            
        }
    
        send(to)
        {
          this.sender = this.owner;
          this.owner = to;
        }
    
        static addFriend(friend)
        {
            if(!this.friends)
            {
                this.friends = [];
            }
            
            
            this.friends.push(friend);
            
        }
    
        static setFriends(friends)
        {
            this.friends = friends;
        }
    }
    
    class Bropheus extends Jig {
        init(series, minRarity) {
            expect(caller).toBeInstanceOf(Sabroshi);
            this.owner = '15KGc84WizJCgJFeuty1rjpBVXrKqRR7iR'
            this.satoshis = 546
            this.series = series;
            this.setup = false;
            this.minRarity = minRarity;
        }
    
    
        set(gender, brow, complexion, complexion_type, eyes, hair, hat, has_hat, mask, has_mask, mouth, nose, dataURL, description) {
    
            this.dataURL = dataURL
            this.description = description;
    
            this.gender = gender
            if (this.gender < 0.5) {
                this.gender = 'female'
            }
            else {
                this.gender = 'male'
            }
    
            this.brow = brow
            if (this.brow < 0.1) {
                this.brow = '/brow/bushybrow'
            }
            else if (this.brow < 0.2) {
                this.brow = '/brow/friendlybrow'
            }
            else if (this.brow < 0.3) {
                this.brow = '/brow/meanbrow'
            }
            else if (this.brow < 0.4) {
                this.brow = '/brow/rektbrow'
            }
            else if (this.brow < 0.5) {
                this.brow = '/brow/sad'
            }
            else if (this.brow < 0.6) {
                this.brow = '/brow/standard'
            }
            else if (this.brow < 0.7) {
                this.brow = '/brow/surprisedbrow'
            }
            else if (this.brow < 0.8) {
                this.brow = '/brow/thiccbrow'
            }
            else if (this.brow < 0.9) {
                this.brow = '/brow/unabrow'
            }
            else if (this.brow < 1) {
                this.brow = null
            }
    
            this.complexion = complexion
            this.complexion_type = complexion_type
            if (this.complexion_type < 0.15) {
    
                if (this.complexion < 0.08) {
                    this.complexion = '/complexions/fantasy/acne'
                }
                else if (this.complexion < 0.16) {
                    this.complexion = '/complexions/fantasy/fantasy1'
                }
                else if (this.complexion < 0.24) {
                    this.complexion = '/complexions/fantasy/fantasy10'
                }
                else if (this.complexion < 0.32) {
                    this.complexion = '/complexions/fantasy/fantasy11'
                }
                else if (this.complexion < 0.40) {
                    this.complexion = '/complexions/fantasy/fantasy2'
                }
                else if (this.complexion < 0.48) {
                    this.complexion = '/complexions/fantasy/fantasy3'
                }
                else if (this.complexion < 0.56) {
                    this.complexion = '/complexions/fantasy/fantasy4'
                }
                else if (this.complexion < 0.64) {
                    this.complexion = '/complexions/fantasy/fantasy5'
                }
                else if (this.complexion < 0.72) {
                    this.complexion = '/complexions/fantasy/fantasy6'
                }
                else if (this.complexion < 0.80) {
                    this.complexion = '/complexions/fantasy/fantasy7'
                }
                else if (this.complexion < 0.88) {
                    this.complexion = '/complexions/fantasy/fantasy8'
                }
                else if (this.complexion < 0.96) {
                    this.complexion = '/complexions/fantasy/fantasy9'
                }
                else {
                    this.complexion = null
                }
    
            }
            else {
    
                if (this.complexion < 0.06) {
                    this.complexion = '/complexions/natural/anon'
                }
                else if (this.complexion < 0.12) {
                    this.complexion = '/complexions/natural/asian'
                }
                else if (this.complexion < 0.18) {
                    this.complexion = '/complexions/natural/black'
                }
                else if (this.complexion < 0.24) {
                    this.complexion = '/complexions/natural/caucasian'
                }
                else if (this.complexion < 0.30) {
                    this.complexion = '/complexions/natural/freckles'
                }
                else if (this.complexion < 0.36) {
                    this.complexion = '/complexions/natural/freckles2'
                }
                else if (this.complexion < 0.42) {
                    this.complexion = '/complexions/natural/lewd'
                }
                else if (this.complexion < 0.48) {
                    this.complexion = '/complexions/natural/redeye'
                }
                else if (this.complexion < 0.54) {
                    this.complexion = '/complexions/natural/redeye2'
                }
                else if (this.complexion < 0.60) {
                    this.complexion = '/complexions/natural/rekt'
                }
                else if (this.complexion < 0.66) {
                    this.complexion = '/complexions/natural/sunburnt'
                }
                else if (this.complexion < 0.72) {
                    this.complexion = '/complexions/natural/tan'
                }
                else if (this.complexion < 0.78) {
                    this.complexion = '/complexions/natural/tan2'
                }
                else if (this.complexion < 0.84) {
                    this.complexion = '/complexions/natural/undead'
                }
                else if (this.complexion < 0.90) {
                    this.complexion = '/complexions/natural/white'
                }
                else {
                    this.complexion = null
                }
            }
    
            this.eyes = eyes
            if (this.eyes < 0.04) {
                this.eyes = '/eyes/bandaid'
            }
            else if (this.eyes < 0.08) {
                this.eyes = '/eyes/clown1'
            }
            else if (this.eyes < 0.12) {
                this.eyes = '/eyes/clown2'
            }
            else if (this.eyes < 0.16) {
                this.eyes = '/eyes/crosseyed'
            }
            else if (this.eyes < 0.20) {
                this.eyes = '/eyes/dumb'
            }
            else if (this.eyes < 0.24) {
                this.eyes = '/eyes/female1'
            }
            else if (this.eyes < 0.28) {
                this.eyes = '/eyes/glasses1'
            }
            else if (this.eyes < 0.32) {
                this.eyes = '/eyes/glasses2'
            }
            else if (this.eyes < 0.36) {
                this.eyes = '/eyes/goggles'
            }
            else if (this.eyes < 0.40) {
                this.eyes = '/eyes/goggles2'
            }
            else if (this.eyes < 0.44) {
                this.eyes = '/eyes/kawaii'
            }
            else if (this.eyes < 0.48) {
                this.eyes = '/eyes/lasers'
            }
            else if (this.eyes < 0.52) {
                this.eyes = '/eyes/lewd'
            }
            else if (this.eyes < 0.56) {
                this.eyes = '/eyes/pepe'
            }
            else if (this.eyes < 0.60) {
                this.eyes = '/eyes/shades1'
            }
            else if (this.eyes < 0.64) {
                this.eyes = '/eyes/shades2'
            }
            else if (this.eyes < 0.68) {
                this.eyes = '/eyes/shades3'
            }
            else if (this.eyes < 0.72) {
                this.eyes = '/eyes/shades4'
            }
            else if (this.eyes < 0.76) {
                this.eyes = '/eyes/shades5'
            }
            else if (this.eyes < 0.80) {
                this.eyes = '/eyes/shades6'
            }
            else if (this.eyes < 0.84) {
                this.eyes = '/eyes/shades7'
            }
            else if (this.eyes < 0.88) {
                this.eyes = '/eyes/shades8'
            }
            else if (this.eyes < 0.92) {
                this.eyes = '/eyes/sleepy'
            }
            else if (this.eyes < 0.96) {
                this.eyes = '/eyes/vampire'
            }
            else if (this.eyes < 0.98) {
                this.eyes = '/eyes/waldo'
            }
            else {
                this.eyes = '/eyes/zombie'
            }
    
            this.hair = hair
            if (this.gender === 'female') {
    
                if (this.hair < 0.12) {
                    this.hair = '/hair/female/avantgarde'
                }
                else if (this.hair < 0.24) {
                    this.hair = '/hair/female/black'
                }
                else if (this.hair < 0.36) {
                    this.hair = '/hair/female/blonde'
                }
                else if (this.hair < 0.48) {
                    this.hair = '/hair/female/bobcut1'
                }
                else if (this.hair < 0.60) {
                    this.hair = '/hair/female/manicpixie'
                }
                else if (this.hair < 0.72) {
                    this.hair = '/hair/female/red1'
                }
                else if (this.hair < 0.84) {
                    this.hair = '/hair/female/red2'
                }
                else if (this.hair < 0.96) {
                    this.hair = '/hair/female/short'
                }
                else {
                    this.hair = null
                }
    
            }
            else {
    
                if (this.hair < 0.06) {
                    this.hair = '/hair/male/afro1'
                }
                else if (this.hair < 0.12) {
                    this.hair = '/hair/male/afro2'
                }
                else if (this.hair < 0.18) {
                    this.hair = '/hair/male/clown1'
                }
                else if (this.hair < 0.24) {
                    this.hair = '/hair/male/clown2'
                }
                else if (this.hair < 0.30) {
                    this.hair = '/hair/male/clown3'
                }
                else if (this.hair < 0.36) {
                    this.hair = '/hair/male/dumbdumber'
                }
                else if (this.hair < 0.42) {
                    this.hair = '/hair/male/finn'
                }
                else if (this.hair < 0.48) {
                    this.hair = '/hair/male/junglist'
                }
                else if (this.hair < 0.54) {
                    this.hair = '/hair/male/mickey'
                }
                else if (this.hair < 0.60) {
                    this.hair = '/hair/male/mickey2'
                }
                else if (this.hair < 0.66) {
                    this.hair = '/hair/male/old1'
                }
                else if (this.hair < 0.72) {
                    this.hair = '/hair/male/rapper'
                }
                else if (this.hair < 0.78) {
                    this.hair = '/hair/male/rapper2'
                }
                else if (this.hair < 0.84) {
                    this.hair = '/hair/male/rick'
                }
                else if (this.hair < 0.90) {
                    this.hair = '/hair/male/skywalker'
                }
                else if (this.hair < 0.96) {
                    this.hair = '/hair/male/waldo'
                }
                else {
                    this.hair = null
                }
    
            }
    
            this.hat = hat
            this.has_hat = has_hat
            if (this.has_hat < 0.6) {
    
                if (this.hat < 0.02) {
                    this.hat = '/hat/afrocomb'
                }
                else if (this.hat < 0.04) {
                    this.hat = '/hat/apple'
                }
                else if (this.hat < 0.06) {
                    this.hat = '/hat/banana'
                }
                else if (this.hat < 0.08) {
                    this.hat = '/hat/bandana'
                }
                else if (this.hat < 0.10) {
                    this.hat = '/hat/baseball1'
                }
                else if (this.hat < 0.12) {
                    this.hat = '/hat/baseball2'
                }
                else if (this.hat < 0.14) {
                    this.hat = '/hat/baseballcap-reverse1'
                }
                else if (this.hat < 0.16) {
                    this.hat = '/hat/baseballcap-reverse2'
                }
                else if (this.hat < 0.18) {
                    this.hat = '/hat/baseballcap1'
                }
                else if (this.hat < 0.20) {
                    this.hat = '/hat/baseballcap2'
                }
                else if (this.hat < 0.22) {
                    this.hat = '/hat/beanie'
                }
                else if (this.hat < 0.24) {
                    this.hat = '/hat/bird'
                }
                else if (this.hat < 0.26) {
                    this.hat = '/hat/blacktophat'
                }
                else if (this.hat < 0.28) {
                    this.hat = '/hat/cat1'
                }
                else if (this.hat < 0.30) {
                    this.hat = '/hat/cat2'
                }
                else if (this.hat < 0.32) {
                    this.hat = '/hat/cherry'
                }
                else if (this.hat < 0.34) {
                    this.hat = '/hat/clown3'
                }
                else if (this.hat < 0.36) {
                    this.hat = '/hat/crock'
                }
                else if (this.hat < 0.38) {
                    this.hat = '/hat/crow'
                }
                else if (this.hat < 0.40) {
                    this.hat = '/hat/dip'
                }
                else if (this.hat < 0.42) {
                    this.hat = '/hat/egg'
                }
                else if (this.hat < 0.44) {
                    this.hat = '/hat/fedora'
                }
                else if (this.hat < 0.46) {
                    this.hat = '/hat/frog'
                }
                else if (this.hat < 0.48) {
                    this.hat = '/hat/indianahat'
                }
                else if (this.hat < 0.50) {
                    this.hat = '/hat/luigi'
                }
                else if (this.hat < 0.52) {
                    this.hat = '/hat/mario'
                }
                else if (this.hat < 0.54) {
                    this.hat = '/hat/melon'
                }
                else if (this.hat < 0.56) {
                    this.hat = '/hat/parrot'
                }
                else if (this.hat < 0.58) {
                    this.hat = '/hat/piratecaptain'
                }
                else if (this.hat < 0.60) {
                    this.hat = '/hat/plums'
                }
                else if (this.hat < 0.62) {
                    this.hat = '/hat/potato'
                }
                else if (this.hat < 0.64) {
                    this.hat = '/hat/purpletophat'
                }
                else if (this.hat < 0.66) {
                    this.hat = '/hat/rangerhat'
                }
                else if (this.hat < 0.68) {
                    this.hat = '/hat/sherlockhat'
                }
                else if (this.hat < 0.70) {
                    this.hat = '/hat/shoe1'
                }
                else if (this.hat < 0.72) {
                    this.hat = '/hat/shoe2'
                }
                else if (this.hat < 0.74) {
                    this.hat = '/hat/shoe3'
                }
                else if (this.hat < 0.76) {
                    this.hat = '/hat/shoe4'
                }
                else if (this.hat < 0.78) {
                    this.hat = '/hat/shoe5'
                }
                else if (this.hat < 0.80) {
                    this.hat = '/hat/synth'
                }
                else if (this.hat < 0.82) {
                    this.hat = '/hat/taco'
                }
                else if (this.hat < 0.84) {
                    this.hat = '/hat/tendie'
                }
                else if (this.hat < 0.86) {
                    this.hat = '/hat/tupac'
                }
                else if (this.hat < 0.88) {
                    this.hat = '/hat/vase'
                }
                else if (this.hat < 0.90) {
                    this.hat = '/hat/waldo'
                }
                else if (this.hat < 0.92) {
                    this.hat = '/hat/wario'
                }
                else {
                    this.hat = null
                }
    
            }
            else {
                this.hat = null
            }
    
            this.mask = mask
            this.has_mask = has_mask
            if (this.has_mask < 0.02) {
    
                if (this.mask < 0.5) {
                    this.mask = '/mask/dekubro'
                }
                else {
                    this.mask = '/mask/shybro'
                }
    
            }
            else {
                this.mask = null
            }
    
            this.mouth = mouth
            if (this.mouth < 0.02) {
                this.mouth = '/mouth/barf'
            }
            else if (this.mouth < 0.04) {
                this.mouth = '/mouth/beard1'
            }
            else if (this.mouth < 0.06) {
                this.mouth = '/mouth/beard2'
            }
            else if (this.mouth < 0.08) {
                this.mouth = '/mouth/beard3'
            }
            else if (this.mouth < 0.10) {
                this.mouth = '/mouth/beard4'
            }
            else if (this.mouth < 0.12) {
                this.mouth = '/mouth/beard5'
            }
            else if (this.mouth < 0.14) {
                this.mouth = '/mouth/beard6'
            }
            else if (this.mouth < 0.16) {
                this.mouth = '/mouth/beard7'
            }
            else if (this.mouth < 0.18) {
                this.mouth = '/mouth/beard8'
            }
            else if (this.mouth < 0.20) {
                this.mouth = '/mouth/beard9'
            }
            else if (this.mouth < 0.22) {
                this.mouth = '/mouth/bitelip'
            }
            else if (this.mouth < 0.24) {
                this.mouth = '/mouth/blunt'
            }
            else if (this.mouth < 0.26) {
                this.mouth = '/mouth/cheer'
            }
            else if (this.mouth < 0.28) {
                this.mouth = '/mouth/clown1'
            }
            else if (this.mouth < 0.30) {
                this.mouth = '/mouth/clown2'
            }
            else if (this.mouth < 0.32) {
                this.mouth = '/mouth/clown3'
            }
            else if (this.mouth < 0.34) {
                this.mouth = '/mouth/drool'
            }
            else if (this.mouth < 0.36) {
                this.mouth = '/mouth/dumb'
            }
            else if (this.mouth < 0.38) {
                this.mouth = '/mouth/female1'
            }
            else if (this.mouth < 0.40) {
                this.mouth = '/mouth/female2'
            }
            else if (this.mouth < 0.42) {
                this.mouth = '/mouth/female3'
            }
            else if (this.mouth < 0.44) {
                this.mouth = '/mouth/female4'
            }
            else if (this.mouth < 0.46) {
                this.mouth = '/mouth/female5'
            }
            else if (this.mouth < 0.48) {
                this.mouth = '/mouth/frustrated'
            }
            else if (this.mouth < 0.50) {
                this.mouth = '/mouth/grin'
            }
            else if (this.mouth < 0.52) {
                this.mouth = '/mouth/gritted'
            }
            else if (this.mouth < 0.54) {
                this.mouth = '/mouth/lewd'
            }
            else if (this.mouth < 0.56) {
                this.mouth = '/mouth/maw'
            }
            else if (this.mouth < 0.58) {
                this.mouth = '/mouth/maw2'
            }
            else if (this.mouth < 0.60) {
                this.mouth = '/mouth/mouse'
            }
            else if (this.mouth < 0.62) {
                this.mouth = '/mouth/neutral'
            }
            else if (this.mouth < 0.64) {
                this.mouth = '/mouth/pepe'
            }
            else if (this.mouth < 0.66) {
                this.mouth = '/mouth/rainbowpuke'
            }
            else if (this.mouth < 0.68) {
                this.mouth = '/mouth/sad'
            }
            else if (this.mouth < 0.70) {
                this.mouth = '/mouth/smilepainaway'
            }
            else if (this.mouth < 0.77) {
                this.mouth = '/mouth/standard'
            }
            else if (this.mouth < 0.84) {
                this.mouth = '/mouth/standard2'
            }
            else if (this.mouth < 0.91) {
                this.mouth = '/mouth/standard3'
            }
            else if (this.mouth < 0.93) {
                this.mouth = '/mouth/stiff'
            }
            else if (this.mouth < 0.95) {
                this.mouth = '/mouth/vampire'
            }
            else if (this.mouth < 0.97) {
                this.mouth = '/mouth/walrus'
            }
            else {
                this.mouth = '/mouth/yawn'
            }
    
            this.nose = nose
            if (this.nose < 0.10) {
                this.nose = '/nose/clown'
            }
            else if (this.nose < 0.20) {
                this.nose = '/nose/lewd'
            }
            else if (this.nose < 0.30) {
                this.nose = '/nose/piercing'
            }
            else if (this.nose < 0.40) {
                this.nose = '/nose/pinocchi'
            }
            else if (this.nose < 0.50) {
                this.nose = '/nose/pointy'
            }
            else {
                this.nose = '/nose/standard'
            }
                
            this.satoshis = 0
            this.setup = true;
            this.destroy()
        }
    
        static addFriend(friend)
        {
            if(!this.friends)
            {
                this.friends = [];
            }
            
            
            this.friends.push(friend);
            
        }
    
        static setFriends(friends)
        {
            this.friends = friends;
        }
    
        set2(gender, brow, complexion, complexion_type, eyes, hair, hat, has_hat, mask, has_mask, mouth, nose, dataURL, description)
        {
            this.dataURL = dataURL
            this.description = description;
            this.justATest = true;
            this.satoshis = 0
            this.setup = true;
            this.destroy()
        }
    
        set3(gender, brow, complexion, complexion_type, eyes, hair, hat, has_hat, mask, has_mask, mouth, nose, dataURL, description)
        {
            this.dataURL = dataURL
            this.description = description;
            this.justATest = true;
            this.satoshis = 0
            this.setup = true;
            this.destroy()
        }
    
        set4(gender, brow, complexion, complexion_type, eyes, hair, hat, has_hat, mask, has_mask, mouth, nose, dataURL, description)
        {
            this.dataURL = dataURL
            this.description = description;
            this.justATest = true;
            this.satoshis = 0
            this.setup = true;
            this.destroy()
        }
    }

    Pack.presets = {
        main: {
            location: "b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o4",
            origin: "b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o4",
            nonce: 1, 
            owner: "18VYxvRrcdMAjsKbhiTuQyCd1ozSiLnN4e",
            satoshis: 0
        }
    }
    
    
    Sabroshi.presets = {
        main: {
            location: "b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o2",
            origin: "b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o2",
            nonce: 1, 
            owner: "18VYxvRrcdMAjsKbhiTuQyCd1ozSiLnN4e",
            satoshis: 0
        }
    }
    
    Bropheus.presets = {
        main: {
                    location: 'b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o3',
        origin: 'b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o3',
        nonce: 1,
        owner: '15KGc84WizJCgJFeuty1rjpBVXrKqRR7iR',
        satoshis: 0
        }
    }

    SabroshiAvatar.presets = {
        main: {
                    location: 'b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o1',
        origin: 'b6b52c142d292df4b8272e934995d89324713a43cee20bd8b931040da05d2cae_o1',
        nonce: 1,
        owner: "18VYxvRrcdMAjsKbhiTuQyCd1ozSiLnN4e",
        satoshis: 0
        }
    }
    


    try{
    let ava = await loadAvatar(run, window.localStorage.sabroshiAvatar);
    if(ava && ava.owner === ava.activeSabroshi.owner)
    {
        let imgTag = new Image();
        let imgData =  ava.activeSabroshi.bropheus.dataURL;
        window.localStorage.sabroshiDataURL = imgData; //sets the image data to be used elsewhere in localstorage
        window.localStorage.sabroshiName = ava.name;
        window.localStorage.sabroshiBio = ava.bio;
        if(display)
        {
            imgTag.src= imgData;
            
            imgTag.className ="sabroshiPicture";
            if(width && height)
            {
            imgTag.width = width;
            imgTag.height = height;
            }
            document.getElementById("sabroshiContainer").append(imgTag);
        }
    }
    else
    {
        console.log("sabroshi is not the same owner as sabroshiAvatar, setting of new Sabroshi is neeeded");
    }
    }
    catch(err)
    {
        console.log("run error " + err.message);
        if(err.message.includes("ClientModeError"))
        {
            await initRun(width, height, false, display);
        }
    }

}



async function loadAvatar(runInstance, avatarLoc)
{
    runInstance.activate();
    let ava = await runInstance.load(avatarLoc);
    await ava.sync({inner: false});
    window.localStorage.sabroshiAvatar = ava.location;  //updating local storage to last known avatar location for faster sync times
    return ava;
}

export default SabroshiLoader;