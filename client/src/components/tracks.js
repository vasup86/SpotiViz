import {useState, useEffect} from "react";
import './Artist.css';
import Cookies from 'universal-cookie';


export default function Tracks(){

    const cookies = new Cookies(document.cookie)["cookies"];
    const [tracksData, setTracksData] = useState({
        items:[]
    })

    const [trackDataRequest, setTrackDataRequest] = useState(true)

    useEffect(()=>{

        if(tracksData.items.length == 0){
            setTrackDataRequest(true)
        }

        if(trackDataRequest){
            console.log(`${cookies["token_type"]} ${cookies["access_token"].trim("\n").trim(" ")}`)
            fetch("https://api.spotify.com/v1/me/top/tracks", {
            headers: {
                Authorization: `${cookies["token_type"]} ${cookies["access_token"]}`
            }
            })
            .then(res => res.json())
            .then(data => {
                // console.log(data)
                setTracksData(data)
                setTrackDataRequest(false)
            })
        }        
    }, [])


    

    const DisplayData= tracksData.items.map((track)=>{
        return(
           
            <div className="card" key={track.id}>
                <div className="wrapper">
                    <img src={track.album.images[0].url} className="cover-image" />
                    
                </div>  
                <div className ="title">
                    {track.name}
                </div>
                <img src={track.album.images[0].url} className="character" />
                <audio controls src={track.preview_url} />
            </div>
        )
    });

    return(
        <div className='Home'>
           {DisplayData}
        </div>
    )
}
