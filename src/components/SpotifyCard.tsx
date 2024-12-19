'use client'
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { SpotifyUserTracksCard } from "./SpotifyUserTracksCard";
import { SpotifyUserPlaylistCard } from "./SpotifyUserPlaylistCard";
import spotifyLogo from '../../public/fonts/Spotify_logo_with_text.svg.webp'
import Image from "next/image";
import { PlaylistsProps, TrackProps } from "./SpotifyToYoutubeCard";

interface SpotifyCardProps {
    isSpotifyLoggedIn: string,
    userTracks: TrackProps[] | null,
    setUserTracks: Dispatch<SetStateAction<TrackProps[] | null>>,
    userPlaylists: PlaylistsProps[] | null,
    setUserPlaylists: Dispatch<SetStateAction<PlaylistsProps[] | null>>,
    selectedMusic: TrackProps[] | [],
    setSelectedMusic: Dispatch<SetStateAction<TrackProps[] | []>>,
    selectedPlaylist: PlaylistsProps|null,
    setSelectedPlaylists: Dispatch<SetStateAction<PlaylistsProps|null>>,
    currentSpotifyCard: ''|'YourTracks'|'Playlists',
    setCurrentSpotifyCard: Dispatch<SetStateAction<''|'YourTracks'|'Playlists'>>,
    totalLikedSongs: number | null,
    setTotalLikedSongs: Dispatch<SetStateAction<number|null>>,
}

export const SpotifyCard = ({
    isSpotifyLoggedIn,
    userTracks,
    setUserTracks,
    userPlaylists,
    setUserPlaylists,
    selectedMusic,
    setSelectedMusic,
    selectedPlaylist,
    setSelectedPlaylists,
    currentSpotifyCard,
    setCurrentSpotifyCard,
    setTotalLikedSongs,
    totalLikedSongs,
}: SpotifyCardProps) => {    
    
    const [nextPageTrackUrl, setNextPageTrackUrl] = useState<string>('https://api.spotify.com/v1/me/tracks');
    const [limit, setLimit] = useState<number>(0);
    const [offset, setOffset] = useState<number>(1);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if(scrollRef.current){
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
                if (scrollTop + clientHeight >= scrollHeight) {
                    if(limit>=offset*20){
                        setOffset((prev) => prev+1);
                    }
                }
            }
        }
        
        const scrollableDiv = scrollRef.current;
        if (scrollableDiv) {
            scrollableDiv.addEventListener('scroll', handleScroll)
            return () => scrollableDiv.removeEventListener('scroll', handleScroll)
        }
    }, [limit, offset])

    useEffect(() => {
        if(isSpotifyLoggedIn==='true' && limit<offset*20 && nextPageTrackUrl){
            ;(async() => {
                try {
                    const res = await axios.get('/api/spotify/getUserTracks', {
                        params: {
                            nextPageUrl: nextPageTrackUrl
                        }
                    });

                    setLimit((prev) => prev+(res?.data?.items?.length));
                    setNextPageTrackUrl(res?.data?.next);
                    setUserTracks((prev) => prev ? [...prev, ...res?.data?.items]: res?.data?.items);
                    setTotalLikedSongs(res?.data?.total);
                } catch (error) {
                    console.error(error);
                }
            })()
        }

    }, [isSpotifyLoggedIn, limit, offset, nextPageTrackUrl, setUserTracks])

    useEffect(() => {
        if(isSpotifyLoggedIn==='true' && !userPlaylists){
            try {
                ;(async() => {
                    const res = await axios.get('api/spotify/getUserPlaylists');
                    setUserPlaylists(res?.data?.items)
                })()
            } catch (error) {
                console.error(error);
            }
        }
    }, [isSpotifyLoggedIn, userPlaylists, setUserPlaylists, setTotalLikedSongs])

    const spotifyLogin = async() => {
        try {
            const res = await axios.get('api/spotify/login');
            const { spotifyAuthURL } = res.data
            window.location.href = spotifyAuthURL
            
          } catch (error) {
            console.error("Error logging in with Spotify:", error);
          }
    }

    return (
        <div className="flex min-w-[500px] max-w-[500px] min-h-[500px] border-r-2 border-gray-500">
            {
                isSpotifyLoggedIn==='false' &&
                <div className="w-full h-full flex items-center justify-center">
                    <button 
                        className="px-4 h-full w-full py-2 flex items-center justify-center" 
                        onClick={spotifyLogin}
                    >
                        <Image src={spotifyLogo} height={200} width={400} alt="Spotify Logo"/>
                    </button>
                </div>
            }
            {
                isSpotifyLoggedIn==='true' &&
                <div className="w-full h-full flex flex-col">
                    <div className="min-h-[44px] max-h-[44px] border-b-2 border-gray-500 px-2 py-1">
                        <div className="flex flex-row justify-evenly">
                            <button 
                                className="text-center text-xl font-bold px-3 py-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentSpotifyCard('YourTracks')
                                }}
                            >
                                Your Tracks
                            </button>
                            <button 
                                className="text-center text-xl font-bold px-3 py-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentSpotifyCard('Playlists')
                                }}
                            >
                                Playlists
                            </button>
                        </div>
                    </div>
                    <div ref={scrollRef} className="max-h-[460px] min-h-[460px] max-w-full flex flex-col overflow-y-scroll gap-1 overflow-hidden ">
                        {
                            currentSpotifyCard==='YourTracks' && userTracks && 
                            <SpotifyUserTracksCard userTracks={userTracks} selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic}/>
                        }

                        {
                            currentSpotifyCard==='Playlists' && userPlaylists && 
                            <SpotifyUserPlaylistCard userPlaylists={userPlaylists} selectedPlaylist={selectedPlaylist} setSelectedPlaylists={setSelectedPlaylists} totalLikedSongs={totalLikedSongs}/>
                        }
                    </div>
                </div>
            }
        </div>
    )
}