import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
  
    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }
  
    try {
      const client_id = process.env.YOUTUBE_CLIENT_ID;
      const client_secret = process.env.YOUTUBE_CLIENT_SECRET;
      const redirect_uri = process.env.YOUTUBE_REDIRECT_URI;

      const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
  
      const { tokens } = await oauth2Client.getToken(code);

      if(tokens && tokens?.access_token){
        oauth2Client.setCredentials(tokens);
        const response = NextResponse.redirect('http://localhost:3000/close-window?type=youtube')
  
        response.cookies.set('youtube-access-token', tokens?.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          path: '/',
          maxAge: 60 * 60,
        })

        return response;
      }else{
        console.error("youtube token fetching failed");
      }
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
