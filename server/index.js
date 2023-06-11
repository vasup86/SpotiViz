// Express Server
// tutorial: https://www.youtube.com/watch?v=Ejg7es3ba2k&t=712s

// npm run dev
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser');

const request = require('request');
const spotifyWebApi = require('spotify-web-api-node')
const querystring = require('querystring');


//set env file
require('dotenv').config()

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const CLIENT_REDIRECT_URI = process.env.CLIENT_REDIRECT_URI;

const credentials = {
    clientId:  CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    redirectUri: REDIRECT_URI
}


//setting CORS and cookie parser
const cors = require('cors')
const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
}


app.use(cors())
app.use(cookieParser());
app.use(express.json()) //parse body as json

global.accessToken;

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};  

app.get('/login', (req, res)=>{
    console.log("12")
    //res.redirect(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${redirect_uri}`)

    //let spotifyAPi = new spotifyWebApi(credentials)

     // your application requests authorization
    const state = generateRandomString(16);
    res.cookie('state', state);
   // const scope = 'user-read-currently-playing  playlist-read-private playlist-read-collaborative user-top-read user-read-recently-played user-library-read';
    const scope = 'user-top-read user-library-read'
        


    const queryParameter = new URLSearchParams({
        response_type: 'code',
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: REDIRECT_URI,
        state: state
    })
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "*");

    res.redirect('https://accounts.spotify.com/authorize?' + queryParameter.toString());
})


const encodeFormData = (data) => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  }
  

app.get('/callback', async (req, res)=>{
     console.log("He")
    // const code = req.query.code || null; 
    // const state = req.query.state || null;
    // console.log(code)

    // const queryParameter = new URLSearchParams({
    //     grant_type: "authorization_code",
    //     code: code,
    //     redirect_uri: REDIRECT_URI
    // })

    // var authOptions = {
    //     url: 'https://accounts.spotify.com/api/token',
    //     form: {
    //       code: code,
    //       redirect_uri: "http://localhost:3000/",
    //       grant_type: 'authorization_code'
    //     },
    //     headers: {
    //       'Authorization': 'Basic ' + (Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')),
    //       'Content-Type' : 'application/x-www-form-urlencoded'
    //     },
    //     json: true
    //   };
    

    // const authString = "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64");
    
    // const response = await fetch("https://accounts.spotify.com/api/token",{
    //     method:"post",
    //     body: queryParameter,
    //     headers:{
    //         "Authorization":authString,
    //         "Content-Type":"application/x-www-form-urlencoded"
    //     }
    // })

    // const data = await response.json();
    // console.log(data)
    // global.accessToken = data.access_token;
    // res.status(200).send({"done":"done"});
    
    //NEW

    const body = {
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }
    
      await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "application/json"
        },
        body: encodeFormData(body)
      })
      .then(response => response.json())
      .then(data => {
        const query = querystring.stringify(data);
        console.log(data)
        res.cookie('access_token', data["access_token"]);
        res.cookie('token_type', data["token_type"]);
        res.cookie('refresh_token', data["refresh_token"]);
        res.redirect(`${CLIENT_REDIRECT_URI}`);
      });
}) 

app.get('/token', (req, res) => {
    res.json({
        access_token: access_token
    })
})


// use ani account 

const portNumber = 1337;
app.listen(portNumber, ()=>{
    console.log(`http://localhost:${portNumber}/login`)
})
