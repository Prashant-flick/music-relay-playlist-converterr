'use client'
import axios from "axios";
import Image from "next/image";
import youtubeLogo from '../../public/fonts/youtube-music7134-removebg-preview.png'
import { PlaylistsProps, TrackProps } from "./SpotifyToYoutubeCard";
import { Minus, PencilLine, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { YoutubePlaylistProps } from "./YoutubeCard";

interface SpotifyTrackSelectionCardProps {
    isYoutubeLoggedIn: string,
    isSpotifyLoggedIn: string,
    userTracks: TrackProps[] | null,
    userPlaylists: PlaylistsProps[] | null,
    selectedMusic: TrackProps[] | [],
    selectedPlaylist: PlaylistsProps|null,
    addPlaylist: boolean,
    setAddPlaylist: Dispatch<SetStateAction<boolean>>,
    playlistName: string,
    setPlaylistName: Dispatch<SetStateAction<string>>,
    selectedPlaylistName: string | undefined,
    setSelectedPlaylistName: Dispatch<SetStateAction<string | undefined>>,
    conversionOptions: ''|'AddToLiked'|'CreatePlaylist'|'addToExistingPlaylist',
    setConversionOption: Dispatch<SetStateAction<''|'AddToLiked'|'CreatePlaylist'|'addToExistingPlaylist'>>,
    selectedConversionPlaylist: YoutubePlaylistProps | null,
    setSelectedConversionPlaylist: Dispatch<SetStateAction<YoutubePlaylistProps|null>>,
    currentSpotifyCard: ''|'YourTracks'|'Playlists',
    setCurrentSpotifyCard: Dispatch<SetStateAction<''|'YourTracks'|'Playlists'>>,
}

export const SpotifyTrackSelectionCard = ({
    isYoutubeLoggedIn,
    selectedMusic,
    selectedPlaylist,
    playlistName,
    setPlaylistName,
    userPlaylists,
    conversionOptions,
    setConversionOption,
    setSelectedConversionPlaylist,
    currentSpotifyCard,
}: SpotifyTrackSelectionCardProps) => {
    
    const [readOnlyNewPlaylist, setReadOnlyNewPlaylist] = useState<boolean>(true)
    const [playlistIndex, setPlaylistIndex] = useState<number|null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false)
    const [userYoutubePlaylists, setUserYoutubePlaylists] = useState<YoutubePlaylistProps[] | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null);

    const youtubeLogin = async() => {
        try {
            const res = await axios.get("/api/youtube/getToken")
            const youtubeAuthUrl = res.data.authUrl;
            window.location.href = youtubeAuthUrl            
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        if (!readOnlyNewPlaylist && inputRef.current) {
            inputRef.current.focus();
        }
    }, [readOnlyNewPlaylist]);

    useEffect(() => {
        if(isYoutubeLoggedIn && (!userYoutubePlaylists || userYoutubePlaylists.length<0)){
            ;((async()=>{
                const res = await axios.get('/api/youtube/getPlaylists');                
                setUserYoutubePlaylists(res.data.items)
            }))()
        }
    },[userYoutubePlaylists, isYoutubeLoggedIn])

    useEffect(() => {
        if(selectedPlaylist){
            setPlaylistName(selectedPlaylist.name);
        }
    },[selectedPlaylist, setPlaylistName])

    useEffect(() => {
        if(currentSpotifyCard){
            setConversionOption('');
        }
    },[currentSpotifyCard, setConversionOption])

    return (
        <div className="flex min-w-[500px] max-w-[500px] min-h-[500px]">
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
                isYoutubeLoggedIn==='true' && currentSpotifyCard==='YourTracks' &&
                <div className="w-full h-full flex flex-col">
                    <div className="max-h-[460px] min-h-[460px] max-w-full h-full gap-1">
                    <div className="min-h-[44px] max-h-[44px] border-b-2 border-gray-500 py-1" />
                        {
                            conversionOptions === '' &&
                            <div className="flex flex-col items-center justify-evenly min-h-[460px]">
                                <button 
                                    onClick={() => {
                                        setConversionOption('AddToLiked')
                                    }}
                                    className="text-3xl font-bold text-black px-6 py-3 bg-violet-500 rounded-xl"
                                >
                                    Add To Liked
                                </button>
                                <button
                                    onClick={() => {
                                        setConversionOption('CreatePlaylist')
                                    }} 
                                    className="text-3xl font-bold text-black px-6 py-3 bg-violet-500 rounded-xl"
                                >
                                    Create New Playlist
                                </button>
                                <button
                                    onClick={() => {
                                        setConversionOption('addToExistingPlaylist')
                                    }} 
                                    className="text-3xl font-bold text-black px-6 py-3 bg-violet-500 rounded-xl">
                                    Add To Existing Playlist
                                </button>
                            </div>   
                        }
                        {
                            currentSpotifyCard === 'YourTracks' && conversionOptions === 'AddToLiked' &&
                            <div className="flex max-h-[460px] min-h-[460px] flex-col justify-start overflow-hidden overflow-y-scroll">
                                <div className="flex gap-1 px-2 relative bg-gray-200 py-1">
                                    <h1
                                        className="text-base font-bold"
                                    >
                                        Add to Liked
                                    </h1>
                                </div>
                                {
                                    selectedMusic && selectedMusic.length>0 &&
                                    selectedMusic?.map((elem, index) =>
                                        <div key={index} className="flex flex-row items-center hover:bg-gray-300 h-auto w-full px-3 py-1 hover:transition-all hover:ease-in-out hover:duration-200">
                                            <label className="flex flex-row items-center w-full h-auto cursor-pointer gap-1">
                                                <Image src={elem?.track?.album?.images[0]?.url} alt="" width={50} height={50} />
                                                <h1 className="text-lg text-black font-semibold px-3 py-1">
                                                    {elem?.track?.name}
                                                </h1>
                                            </label>
                                        </div>
                                    )
                                }
                            </div>
                        }

                        {   
                            currentSpotifyCard === 'YourTracks' && conversionOptions === 'CreatePlaylist' &&
                            <div className="flex flex-col justify-start max-h-[460px] min-h-[460px] overflow-hidden overflow-y-scroll">
                                <div className="flex gap-1 px-2 bg-gray-200 py-1">
                                    <input
                                        ref={inputRef}
                                        className={`text-base font-bold bg-transparent outline-none ${
                                            readOnlyNewPlaylist ? 'cursor-default caret-transparent' : 'cursor-text caret-black'
                                        }`}
                                        value={playlistName}
                                        onChange={(e) => {
                                            setPlaylistName(e.target.value)
                                        }}
                                        placeholder="Playlist Name"
                                        style={{ maxWidth: `${playlistName.length * 8}px` }}
                                        readOnly={readOnlyNewPlaylist}
                                    />
                                    <button
                                        onClick={() => {
                                            setReadOnlyNewPlaylist((prev) => !prev)
                                        }}
                                        className="flex justify-center items-center"
                                    >
                                        <PencilLine height={20} width={20}/>
                                    </button>
                                </div>
                                {
                                    selectedMusic && selectedMusic.length>0 &&
                                    selectedMusic?.map((elem, index) =>
                                        <div key={index} className="flex flex-row items-center hover:bg-gray-300 h-auto w-full px-3 py-1 hover:transition-all hover:ease-in-out hover:duration-200">
                                            <label className="flex flex-row items-center w-full h-auto cursor-pointer gap-1">
                                                <Image src={elem?.track?.album?.images[0]?.url} alt="" width={50} height={50} />
                                                <h1 className="text-lg text-black font-semibold px-3 py-1">
                                                    {elem?.track?.name}
                                                </h1>
                                            </label>
                                        </div>
                                    )
                                }
                            </div>
                        }
                        
                        {   
                            currentSpotifyCard === 'YourTracks' && conversionOptions === 'addToExistingPlaylist' &&
                            <div className="flex flex-col justify-start max-h-[460px] min-h-[460px] overflow-hidden overflow-y-scroll">
                                <h1 className="flex gap-1 px-2 relative bg-gray-200 py-1 text-base font-bold">Choose Playlist</h1> 
                            {
                                userPlaylists && userPlaylists.length>0 &&
                                userYoutubePlaylists?.map((elem, index) => {
                                    return(
                                        <button 
                                            onClick={(e) => {
                                                e.preventDefault();
                                                if(index===playlistIndex){
                                                    setIsChecked((prev) => !prev);
                                                    if(isChecked){
                                                        setSelectedConversionPlaylist(null);
                                                    }else{
                                                        setSelectedConversionPlaylist(elem);
                                                    }
                                                }else{
                                                    setPlaylistIndex(index)
                                                    setIsChecked(true)
                                                    setSelectedConversionPlaylist(elem)
                                                }
                                            }}
                                            key={index} 
                                            className="px-3 py-1 flex flex-row w-full items-center hover:bg-gray-300 hover:transition-all hover:ease-in-out hover:duration-200"
                                        >
                                            <input
                                                checked={index===playlistIndex && isChecked}
                                                onChange={() => {

                                                }}
                                                type="checkbox" 
                                                className="transform scale-150 mr-3 hover:cursor-pointer pointer-events-none"
                                            />
                                            <Image src={elem?.snippet?.thumbnails?.medium?.url} alt="" width={100} height={100} />
                                            <div className="flex flex-col items-start justify-start px-3 py-1">
                                                <h1 className="text-lg text-black font-semibold">
                                                    {elem?.snippet?.title}
                                                </h1>
                                                <h3>{elem.contentDetails.itemCount} Tracks</h3>
                                            </div>
                                        </button>
                                    )
                                })
                            }
                            </div>
                        }
                    </div>
                </div>
            }
            {
                isYoutubeLoggedIn==='true' && currentSpotifyCard==='Playlists' &&
                <div className="w-full h-full flex flex-col overflow-hidden overflow-y-scroll">
                    <div className="min-h-[44px] max-h-[44px] border-b-2 border-gray-500 py-1"/>
                    {
                        conversionOptions === '' &&
                        <div className="flex flex-col items-center justify-evenly min-h-[460px]">
                            <button
                                onClick={() => {
                                    setConversionOption('CreatePlaylist')
                                }} 
                                className="text-3xl font-bold text-black px-6 py-3 bg-violet-500 rounded-xl"
                            >
                                Create New Playlist
                            </button>
                            <button
                                onClick={() => {
                                    setConversionOption('addToExistingPlaylist')
                                }} 
                                className="text-3xl font-bold text-black px-6 py-3 bg-violet-500 rounded-xl">
                                Add To Existing Playlist
                            </button>
                        </div>   
                    }
                    {   
                        (currentSpotifyCard === 'Playlists' && conversionOptions === 'CreatePlaylist' && selectedPlaylist) &&
                        <>
                            <div className="ml-2 flex gap-1 px-2 py-1 justify-center items-center h-full">
                                <input
                                    ref={inputRef}
                                    className={`text-2xl font-bold bg-transparent outline-none ${
                                        readOnlyNewPlaylist ? 'cursor-default caret-transparent' : 'cursor-text caret-black'
                                    } border-b-2 border-black`}
                                    value={playlistName}
                                    onChange={(e) => {
                                        setPlaylistName(e.target.value)
                                    }}
                                    placeholder="Playlist Name"
                                    style={{ maxWidth: `${playlistName.length * 11.5}px` }}
                                    readOnly={readOnlyNewPlaylist}
                                />
                                <button
                                    onClick={() => {
                                        setReadOnlyNewPlaylist((prev) => !prev)
                                    }}
                                    className="flex justify-center items-center"
                                >
                                    <PencilLine height={24} width={24}/>
                                </button>
                            </div>
                        </>
                    }
                    {
                        (currentSpotifyCard === 'Playlists' && conversionOptions === 'addToExistingPlaylist' && selectedPlaylist) &&
                        <div className="flex flex-col justify-start">
                            <h1 className="flex gap-1 px-2 relative bg-gray-200 py-1 text-base font-bold">Selected Playlist</h1>
                            <div className="flex justify-start items-center pl-2">
                                <Image src={selectedPlaylist?.images[0]?.url} alt="" width={50} height={50} />
                                <div className="flex flex-col items-start justify-start px-3 py-1">
                                    <h1 className="text-lg text-black font-semibold">
                                        {selectedPlaylist?.name}
                                    </h1>
                                    <h3>{selectedPlaylist?.tracks?.total} Tracks</h3>
                                </div>
                            </div>
                            <h1 className="flex gap-1 px-2 relative bg-gray-200 py-1 text-base font-bold">Choose Playlist</h1> 
                        {
                            userPlaylists && userPlaylists.length>0 &&
                            userYoutubePlaylists?.map((elem, index) => {
                                return(
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if(index===playlistIndex){
                                                setIsChecked((prev) => !prev);
                                                if(isChecked){
                                                    setSelectedConversionPlaylist(null);
                                                }else{
                                                    setSelectedConversionPlaylist(elem);
                                                }
                                            }else{
                                                setPlaylistIndex(index)
                                                setIsChecked(true)
                                                setSelectedConversionPlaylist(elem)
                                            }
                                        }}
                                        key={index} 
                                        className="px-2 py-1 flex flex-row w-full items-center hover:bg-gray-300 hover:transition-all hover:ease-in-out hover:duration-200"
                                    >
                                        <input
                                            checked={index===playlistIndex && isChecked}
                                            onChange={() => {

                                            }}
                                            type="checkbox" 
                                            className="transform scale-150 mr-3 hover:cursor-pointer pointer-events-none"
                                        />
                                        <Image src={elem?.snippet?.thumbnails?.medium?.url} alt="" width={100} height={100} />
                                        <div className="flex flex-col items-start justify-start px-3 py-1">
                                            <h1 className="text-lg text-black font-semibold">
                                                {elem?.snippet?.title}
                                            </h1>
                                            <h3>{elem.contentDetails.itemCount} Tracks</h3>
                                        </div>
                                    </button>
                                )
                            })
                        }
                        </div>
                    }
                    {
                        currentSpotifyCard==='Playlists' && !selectedPlaylist && conversionOptions!=='' &&
                        <>
                            <div className="ml-2 flex gap-1 px-2 py-1 justify-center items-center h-full">
                                <h1 className="text-3xl font-bold">Select a Playlist</h1>
                            </div>
                        </>
                    }
                </div>
            }
        </div>
    )
}