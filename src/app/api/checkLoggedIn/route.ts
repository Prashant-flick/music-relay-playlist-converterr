import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookie = cookies();
    const spotifyAccessToken = cookie.get('access_token')?.value;
    const youtubeAccessToken = cookie.get('youtube-access-token')?.value

    return NextResponse.json({
        isSpotifyloggedIn: spotifyAccessToken ? true : false,
        isYoutubeloggedIn: youtubeAccessToken ? true : false,
    })
}