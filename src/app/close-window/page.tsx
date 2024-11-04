import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface SearchParams {
  type?: string;
}

export default function CloseWindow({ searchParams }: { searchParams: SearchParams }) {
  const cookie = cookies();
  const spotifyAccessToken = cookie.get('access_token')?.value;
  const youtubeAccessToken = cookie.get('youtube-access-token')?.value
  
  const type = searchParams?.type;
  
  if(type==='spotify' && spotifyAccessToken){
    redirect('http://localhost:3000/home?spotifyAuth=passed')
  }else if(type==='spotify'){
    redirect('http://localhost:3000/home?spotifyAuth=failed')
  }
  if(type==='youtube' && youtubeAccessToken){
    redirect('http://localhost:3000/home?youtubeAuth=passed')
  }else if(type==='youtube'){
    redirect('http://localhost:3000/home?youutbeAuth=failed')
  }

  return (
    <div>
      <h1>Authentication Successful!</h1>
      <p>You can close this window if it doesn't close automatically.</p>
    </div>
  );
}
