import './App.css';
import {useState, useEffect} from "react";
import Cookies from 'universal-cookie';

import Artist from './components/Artist';

import Home from './components/Home';

import {Routes, Route, Link} from "react-router-dom";
import Login from './components/Login';

import Tracks from './components/tracks';
// require('dotenv').config();


export default function App() {

  const [data, setData] = useState(false);

  const CLIENT_ID = process.env.CLIENT_ID;
  const CLIENT_SECRET = process.env.CLIENT_SECRET;
  const REDIRECT_URI = process.env.REDIRECT_URI;

  const cookies = new Cookies(document.cookie)["cookies"];

  //https://ahmetomer.net/spotify-api-authorization-in-nodejs/
  const click = async () => {
      
    const response = await fetch("http://localhost:1337/login", {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json"
      }
    })
    setData(true)
    console.log(await response.json())
  }

  

  const artist =  () => {
    setAlbumDataRequest(false)
    if(artistDataRequest){
      console.log(`${cookies["token_type"]} ${cookies["access_token"].trim("\n").trim(" ")}`)
     fetch("https://api.spotify.com/v1/me/top/artists", {
      headers: {
        Authorization: `${cookies["token_type"]} ${cookies["access_token"]}`
      }
    })
    .then(res => res.json())
    .then(data => {
      // use data
      //console.log(data)
      setArtistData(data)
      setArtistDataRequest(false)
    })
  }

  }

  const [artistData, setArtistData] = useState({
    items:[]
  })
  const [artistDataRequest,setArtistDataRequest ] = useState(true)
  const [albumDataRequest,setAlbumDataRequest ] = useState(true)
  
  return (
    // <div className="App">
    //  <button onClick={click}>Press</button>

    //  {/*https://stackoverflow.com/questions/26029627/angular-node-express-passport-cross-domain-problems-enable-cors-passport-faceb soln, use a tag */ }
    //  <a href="http://localhost:1337/login">sign in with spotify</a>
    //  {cookies["access_token"] && <h1>Hello</h1>}
    //  {cookies["access_token"] && <button onClick={artist}>Artist</button>}
    //  {!artistDataRequest && <Artist data={artistData}></Artist>}
     
    // </div>
		<>
            <nav>
                <Link to="/" >Home</Link>
                <Link to="/artist" >Artist</Link>
				       <Link to="/tracks">Tracks</Link>
            </nav>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Home/>}/>
            <Route path="/artist" element={<Artist/>}/>
            <Route path="/tracks" element={<Tracks/>}/>
          </Routes>
        </>
  );
}