import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client_id = process.env.YOUTUBE_CLIENT_ID_4;
    const client_secret = process.env.YOUTUBE_CLIENT_SECRET_4;
    const redirect_uri = process.env.YOUTUBE_REDIRECT_URI;
    const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtubepartner', 'https://www.googleapis.com/auth/youtube.force-ssl'];

    const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri);
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });
    
    return NextResponse.json({ authUrl });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
