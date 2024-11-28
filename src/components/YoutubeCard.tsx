'use client'
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import youtubeLogo from '../../public/fonts/youtube-music7134-removebg-preview.png'

export interface YoutubeCardProps {
    isYoutubeLoggedIn: string,
}

export interface YoutubePlaylistProps {
    id: string,
    snippet: {
        channelId: string,
        title: string,
        thumbnails: {
            default:{
                url: string,
            },
            medium: {
                url: string
            }
        }
    },
    contentDetails: {
        itemCount: number,
    }
}

export interface YoutubeLikedVideoProps {
    id: string,
    snippet: {
        thumbnails: {
            medium: {
                url: string,
            },
            default: {
                url: string
            }
        },
        localized: {
            title: string,
        },
        categoryId: string
    }
}

export const YoutubeCard = ({
    isYoutubeLoggedIn
}: YoutubeCardProps) => {    
    const [userYoutubePlaylists, setUserYoutubePlaylists] = useState<YoutubePlaylistProps[] | null>(null)
    const [userYoutubeMusicTracks, setUserYoutubeMusicTracks] = useState<YoutubeLikedVideoProps[] | null>(null)
    const [currentYoutubeCard, setCurrentYoutubeCard] = useState<'YourTracks'|'Playlists'|''>('YourTracks')
    const [limit, setLimit] = useState<number>(0);
    const [offset, setOffset] = useState<number>(1);
    // const [youtubeTrackNextPage, setYoutubeTrackNextPage] = useState<string|''>('');

    setUserYoutubeMusicTracks(null);
    setUserYoutubePlaylists(null);
    setLimit(0);

    const scrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            if(scrollRef.current){
                const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
                if(scrollTop + clientHeight >= scrollHeight) {                    
                    if(limit>=offset*20){
                        setOffset((prev) => prev+1)
                    }
                }
            }
        }

        const scrollableDiv = scrollRef.current;
        if(scrollableDiv){
            scrollableDiv.addEventListener('scroll', handleScroll);
            return () => scrollableDiv.removeEventListener('scroll', handleScroll);
        }
    } , [offset, limit])

    const youtubeLogin = async() => {
        try {
            const res = await axios.get("/api/youtube/getToken")
            const youtubeAuthUrl = res.data.authUrl;
            window.location.href = youtubeAuthUrl            
        } catch (error) {
            console.error(error);
        }
    }

    // useEffect(() => {
    //     if(isYoutubeLoggedIn==='true' && !userYoutubePlaylists){
    //         try {
    //             ;(async() => {
    //                 const res = await axios.get('/api/youtube/getPlaylists');
    //                 setUserYoutubePlaylists(res.data.items)
    //             })()
    //         } catch (error) {
    //             console.error(error);
    //         }
    //     }
    // }, [isYoutubeLoggedIn, userYoutubePlaylists]) 
    
    // useEffect(() => {
    //     if(isYoutubeLoggedIn==='true' && limit<(offset*20) && youtubeTrackNextPage!==null){           
    //         try {
    //             ;(async() => {
    //                 const res = await axios.get('/api/youtube/getUserLikedMusic', {
    //                     params: {
    //                         nextPageToken: youtubeTrackNextPage || '',
    //                     },
    //                 });
    
    //                 if (res && res.data) {
    //                     setLimit((prev) => prev + (res?.data?.musicItems?.length || 0));
    //                     setYoutubeTrackNextPage(res.data.nextPageToken || null);
    //                     setUserYoutubeMusicTracks((prev) =>
    //                         prev ? [...prev, ...res.data.musicItems] : res.data.musicItems
    //                     )
    //                 }
    //             })()
    //         } catch (error) {
    //             console.error("Error fetching YouTube liked music:", error);
    //         }
    //     }
    // }, [isYoutubeLoggedIn, userYoutubeMusicTracks, youtubeTrackNextPage, limit, offset])

    return (
        <div className="flex min-w-[500px] min-h-[500px] bg-gray-100">
            {
                isYoutubeLoggedIn==='false' &&
                <div className="w-full h-full flex items-center justify-center">
                    <button 
                        className="px-4 py-2 h-full w-full flex items-center justify-center" 
                        onClick={youtubeLogin}
                    >
                        <Image src={youtubeLogo} height={230} width={460} alt="Spotify Logo"/>
                    </button>
                </div>
            }
            {
                isYoutubeLoggedIn==='true' &&
                <div className="w-full h-full flex flex-col">
                    <div className="min-h-[40px] border-b-2 border-gray-500 px-2 py-1">
                        <div className="flex flex-row justify-evenly">
                            <button
                                className="text-center text-xl font-bold px-3 py-1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentYoutubeCard('YourTracks')
                                }}
                            >
                                Your Tracks
                            </button>
                            <button 
                                className="text-center text-xl font-bold"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentYoutubeCard('Playlists')
                                }}
                            >
                                Playlists
                            </button>
                        </div>
                    </div>
                    <div ref={scrollRef} className="max-h-[460px] min-h-[460px] max-w-[500px] flex flex-col px-4 py-2 overflow-y-scroll gap-1">
                        {currentYoutubeCard==='YourTracks' && userYoutubeMusicTracks && 
                            userYoutubeMusicTracks?.map((elem, index) =>
                                <div key={index} className="flex flex-row items-center gap-1">
                                    <Image src={elem?.snippet?.thumbnails?.medium?.url} alt="" width={50} height={50} />
                                    <h1 className="text-lg text-black font-semibold px-3 py-1">
                                        {elem?.snippet?.localized?.title}
                                    </h1>
                                </div>
                            )
                        }

                        {
                            currentYoutubeCard==='Playlists' && userYoutubePlaylists && 
                            userYoutubePlaylists?.map((elem, index) =>
                                <button key={index} className="flex flex-row items-center gap-1">
                                    <Image src={elem?.snippet?.thumbnails?.medium?.url} alt="" height={80} width={80} />
                                    <h1 className="text-lg text-black font-semibold px-3 py-1">
                                        {elem?.snippet?.title}
                                    </h1>
                                </button>
                            )
                        }
                    </div>
                </div>
            }
        </div>
    )
}