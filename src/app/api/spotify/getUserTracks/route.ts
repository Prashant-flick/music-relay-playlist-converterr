import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest){
    const cookie = cookies();
    const spotifyAccessToken = cookie.get('access_token')?.value
    const nextPageUrl = (req.nextUrl.searchParams.get('nextPageUrl'))!=='' ?  req.nextUrl.searchParams.get('nextPageUrl') : 'https://api.spotify.com/v1/me/tracks';

    if(spotifyAccessToken && nextPageUrl){
        try {
            const res = await axios.get(nextPageUrl, {
                headers: {
                    Authorization: `Bearer ${spotifyAccessToken}`
                }
            })    
            return NextResponse.json(res.data);
        } catch (error) {
            return NextResponse.json({
                message: "failed to fetch data or accesstoken invalid",
                error: error
            })
        }
    }else{
        return NextResponse.json({
            message: "spotify access Token not found"
        })
    }
}