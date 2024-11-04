import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
    const cookie = cookies();
    const youtubeAccessToken = cookie.get('youtube-access-token')?.value;
    const spotifyAccessToken = cookie.get('access_token')?.value

    return NextResponse.json({
        youtubeAccessToken: youtubeAccessToken,
        spotifyAccessToken: spotifyAccessToken,
    })
}