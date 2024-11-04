import axios from "axios"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET(){
    const cookie = cookies()
    const youtubeAccessToken = cookie.get('youtube-access-token')?.value

    if(youtubeAccessToken){
        const res = await axios.get('https://www.googleapis.com/youtube/v3/playlists?mine=true&part=contentDetails&part=snippet', {
            headers: {
                Authorization: `Bearer ${youtubeAccessToken}`,
            }
        })

        return NextResponse.json(res.data);
    }else{
        return NextResponse.json({
            message: "invalid youtubeAccessToken"
        })
    }
}