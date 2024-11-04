import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookie = cookies();
    const spotifyAccessToken = cookie.get('access_token')?.value
    console.log(spotifyAccessToken);
    console.log("here");

    if(spotifyAccessToken){
        const res = await axios.get('https://api.spotify.com/v1/me/playlists', {
            headers: {
                Authorization: `Bearer ${spotifyAccessToken}`
            }
        })

        return NextResponse.json(res.data)
    }else{
        return NextResponse.json({
            message: "not authorized or wrong api route"
        })
    }
}