import {useState, useEffect} from "react";
import './Artist.css';
import Cookies from 'universal-cookie';
import {Card, CardContent, Typography, CardMedia} from '@mui/material';


export default function Artist(){

    const cookies = new Cookies(document.cookie)["cookies"];
    const [artistData, setArtistData] = useState({
        items:[]
    })
    const [albumDataRequest,setAlbumDataRequest ] = useState(true)

    useEffect(()=>{
        if(artistData.items.length == 0){
            setAlbumDataRequest(true)
        }

        if(albumDataRequest){
            console.log(`${cookies["token_type"]} ${cookies["access_token"].trim("\n").trim(" ")}`)
            fetch("https://api.spotify.com/v1/me/top/artists", {
            headers: {
                Authorization: `${cookies["token_type"]} ${cookies["access_token"]}`
            }
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setArtistData(data)
                setAlbumDataRequest(false)
            })
        }
    }, [])

    const DisplayData= artistData.items.map((artist)=>{
        return(
           
            <div className="card" key={artist.id}>
                <div className="wrapper">
                    <img src={artist.images[0].url} className="cover-image" />
                </div>  
                <div className ="title">
                    {artist.name}
                </div>
                <img src={artist.images[0].url} className="character" />
            </div>
        )
    });

    return(
        <div className='Home'>
           {DisplayData}
        </div>
    )
}
