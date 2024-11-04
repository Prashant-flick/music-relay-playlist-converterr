import { Card } from "@/components/Card";
import { cookies } from "next/headers";

export default async function Home() {
  let isSpotifyLoggedIn: string = 'false';
  let isYoutubeLoggedIn: string = 'false';
  const cookie = cookies();
  const spotifyAccessToken = cookie.get('access_token')?.value
  const youtubeAccessToken = cookie.get('youtube-access-token')?.value

  if(spotifyAccessToken){
    isSpotifyLoggedIn = 'true'
  }
  if(youtubeAccessToken){
    isYoutubeLoggedIn = 'true'
  } 

  return (
    <div >
        <Card isSpotifyLoggedIn={isSpotifyLoggedIn} isYoutubeLoggedIn={isYoutubeLoggedIn}/>
    </div>
  );
}
