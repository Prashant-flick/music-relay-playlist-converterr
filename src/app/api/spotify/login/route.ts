import { NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid'
import querystring from 'querystring'

export async function GET(){
    const client_id = process.env.SPOTIFY_CLIENT_ID;
    const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
    
    const state = uuidv4();
    const scope = 'user-read-private user-read-email user-library-read user-top-read';

    const spotifyAuthURL = 'https://accounts.spotify.com/authorize?' + 
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
        show_dialog: 'true',
    });

    return NextResponse.json({spotifyAuthURL})
}