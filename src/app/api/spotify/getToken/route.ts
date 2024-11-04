import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const baseUrl = "http://localhost:3000"
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

  if (!state) {
    return NextResponse.redirect(`${baseUrl}/?` + new URLSearchParams({ error: 'state_mismatch' }));
  }

  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: new URLSearchParams({
      code: code ? code : '',
      redirect_uri: redirect_uri ? redirect_uri : '',
      grant_type: 'authorization_code',
    }).toString(),
  };

  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
    const tokenData = await tokenResponse.json();    

    if (tokenResponse.ok) {
      const response = NextResponse.redirect(`${baseUrl}/close-window?type=spotify`);

      response.cookies.set('access_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60,
      });

      return response;
    } else {
      return NextResponse.redirect(`${baseUrl}/?` + new URLSearchParams({ error: 'invalid_token' }));
    }
  } catch (error) {
    console.error('Error fetching token:', error);
    return NextResponse.redirect(`${baseUrl}/?` + new URLSearchParams({ error: 'token_error' }));
  }
}
