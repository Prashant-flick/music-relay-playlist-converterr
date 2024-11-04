'use client'

import Image from "next/image"
import { PlaylistsProps } from "./SpotifyToYoutubeCard"
import { Dispatch, SetStateAction, useEffect, useState } from "react"

interface SpotifyUserPlaylistCardProps {
    userPlaylists: PlaylistsProps[],
    selectedPlaylist: PlaylistsProps|null,
    setSelectedPlaylists: Dispatch<SetStateAction<PlaylistsProps|null>>,
}

export const SpotifyUserPlaylistCard = ({
    userPlaylists,
    selectedPlaylist,
    setSelectedPlaylists,
}: SpotifyUserPlaylistCardProps) => {
    
    const [playlistIndex, setPlaylistIndex] = useState<number|null>(null);
    const [isChecked, setIsChecked] = useState<boolean>(false)
    
    useEffect(() => {
        if(selectedPlaylist || selectedPlaylist===null){
            localStorage.setItem('Spotify-playlist', JSON.stringify(selectedPlaylist));
        }
    }, [selectedPlaylist])

    return (
        <>
            {userPlaylists && userPlaylists.length>0 &&
                userPlaylists?.map((elem, index) => {
                    return(
                        <button 
                            onClick={(e) => {
                                e.preventDefault();
                                if(index===playlistIndex){
                                    setIsChecked((prev) => !prev);
                                    if(isChecked){
                                        setSelectedPlaylists(null);
                                    }else{
                                        setSelectedPlaylists(elem);
                                    }
                                }else{
                                    setPlaylistIndex(index)
                                    setIsChecked(true)
                                    setSelectedPlaylists(elem)
                                }
                            }}
                            key={index} 
                            className="px-3 py-1 flex flex-row items-center hover:bg-gray-300 hover:transition-all hover:ease-in-out hover:duration-200"
                        >
                            <input
                                checked={index===playlistIndex && isChecked}
                                onChange={() => {

                                }}
                                type="checkbox" 
                                className="transform scale-150 mr-3 hover:cursor-pointer pointer-events-none"
                            />
                            <Image src={elem?.images[0]?.url} alt="" width={50} height={50} />
                            <div className="flex flex-col items-start justify-start px-3 py-1">
                                <h1 className="text-lg text-black font-semibold">
                                    {elem?.name}
                                </h1>
                                <h3>{elem?.tracks?.total} Tracks</h3>
                            </div>
                            
                        </button>
                    )
                })
            }
        </>
    )
}