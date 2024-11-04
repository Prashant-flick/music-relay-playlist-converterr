'use client'

import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Image from "next/image"
import { TrackProps } from "./SpotifyToYoutubeCard"

interface SpotifyUserTracksCardProps {
    userTracks: TrackProps[],
    selectedMusic: TrackProps[] | [],
    setSelectedMusic: Dispatch<SetStateAction<TrackProps[] | []>>,
}

export const SpotifyUserTracksCard = ({
    userTracks,
    selectedMusic,
    setSelectedMusic,
}: SpotifyUserTracksCardProps) => {
    const [selectAll, setSelectAll] = useState<'false'|'true'|null>(null)

    useEffect(() => {
        if(selectedMusic){
            localStorage.setItem('Spotify-music', JSON.stringify(selectedMusic));
        }
    }, [selectedMusic])

    const handleOnChange = ({isChecked, track}: {isChecked: boolean, track: TrackProps}) => {
        setSelectAll(null)
        if(isChecked && track){
            setSelectedMusic((prev) => [...prev, track])
        }else if(!isChecked && track){
            setSelectedMusic((prev) => prev.filter((elem) => {
                return elem?.track?.name!==track?.track?.name
            }))
        }
    }

    const handleSelectAll = (e) => {
        if(e.target.checked){
            setSelectAll('true');
            setSelectedMusic(userTracks)
        }else{
            setSelectAll('false')
            setSelectedMusic([]);
        }
    }

    return (
        <>
            <div className="flex flex-row h-full w-full px-3 py-1 hover:bg-gray-300 hover:transition-all hover:ease-in-out hover:duration-200">
                <label className="flex flex-row cursor-pointer h-full w-full">
                    <input onChange={handleSelectAll} type="checkbox" className="transform scale-150 mr-4 pointer-events-none"/>
                    <h1 className="font-bold">Select All</h1>
                </label>
            </div>
            {userTracks && userTracks.length>0 &&
                userTracks?.map((elem, index) =>
                    <div key={index} className="flex flex-row items-center hover:bg-gray-300 h-full w-full px-3 py-1 hover:transition-all hover:ease-in-out hover:duration-200">
                        <label className="flex flex-row items-center w-full h-full cursor-pointer gap-1">
                            <input
                                {...(selectAll === 'true' ? { checked: true } : selectAll === 'false' ? { checked: false } : {})}
                                onChange={(e) => {
                                    if(e.target.checked){
                                        handleOnChange({isChecked:true, track:elem})
                                    }else{
                                        handleOnChange({isChecked:false, track:elem})
                                    }
                                }} 
                                type="checkbox" 
                                className="transform scale-150 mr-2 pointer-events-none"
                            />
                            <Image src={elem?.track?.album?.images[0]?.url} alt="" width={50} height={50} />
                            <h1 className="text-lg text-black font-semibold px-3 py-1">
                                {elem?.track?.name}
                            </h1>
                        </label>
                    </div>
                )
            }
        </>
    )
}