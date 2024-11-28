'use client'

import { addToYoutubeLikedMusic, addTracksToPlaylist, createNewYoutubePlaylist, getYoutubeTracksIds } from "@/actions/getYoutubeTracksIds"
import { useToast } from "@/context/toast";
import { useState } from "react";
import { PlaylistsProps, TrackProps } from "./SpotifyToYoutubeCard";
import { YoutubePlaylistProps } from "./YoutubeCard";

interface ConvertButtonProps {
    isSpotifyLoggedIn: string,
    isYoutubeLoggedIn: string,
    addPlaylist: boolean,
    playlistName: string,
    selectedPlaylistName: string | undefined,
    selectedMusic: TrackProps[]|[],
    selectedPlaylist: PlaylistsProps|null,
    conversionOptions: ''|'AddToLiked'|'CreatePlaylist'|'addToExistingPlaylist',
    selectedConversionPlaylist: YoutubePlaylistProps | null,
    currentSpotifyCard: ''|'YourTracks'|'Playlists',
}

export const ConvertButton = ({
    isSpotifyLoggedIn,
    isYoutubeLoggedIn,
    addPlaylist,
    playlistName,
    selectedMusic,
    selectedPlaylist,
    conversionOptions,
    selectedConversionPlaylist,
}: ConvertButtonProps) => {

    const [loading, setLoading] = useState<boolean>(false);
    const toast = useToast();

    const handleConvertion = async() => {
        if(selectedMusic && selectedMusic.length<=0 && !selectedPlaylist){
            toast?.open({
                message: "Add some music and playlist to convert",
                status: false
            })
            return;
        }

        if(selectedMusic && selectedMusic.length>0 && conversionOptions==='' && !selectedPlaylist){
            toast?.open({
                message: "choose track playlist or add to liked",
                status: false
            })
            return;
        }

        if(selectedPlaylist && !addPlaylist){
            toast?.open({
                message: "choose playlist",
                status: false,
            })
            return;
        }

        if(selectedMusic && selectedMusic.length>0 && conversionOptions!=='' && isYoutubeLoggedIn==='true' && isSpotifyLoggedIn==='true'){
            setLoading(true)
            try {
                const youtubeMusicIds = await getYoutubeTracksIds({spotifyMusic: selectedMusic, spotifyPlaylist:null})
                if(youtubeMusicIds && youtubeMusicIds.length>0){
                    if(conversionOptions==='AddToLiked'){
                        await addToYoutubeLikedMusic({youtubeMusicIds})
                    }
                    if(conversionOptions==='CreatePlaylist'){
                        const res = await createNewYoutubePlaylist({playlistName});
                        if(res.status===200){
                            const res2 = await addTracksToPlaylist({youtubeMusicIds, id:res.data.id})
                            if(res2.status!==200){
                                toast?.open({message:"Conversion failed", status: false})
                                setLoading(false)
                                return;
                            }
                        }
                    }
                    if(conversionOptions==='addToExistingPlaylist'){
                        if(selectedConversionPlaylist!==null){
                            const res2 = await addTracksToPlaylist({youtubeMusicIds, id:selectedConversionPlaylist?.id})
                            if(res2.status!==200){
                                toast?.open({message:"Conversion failed", status: false})
                                setLoading(false)
                                return;
                            }
                        }
                    }
                }
                toast?.open({message:"Conversion successfull", status: true})
                setLoading(false)
            } catch (error) {
                console.log(error);
                toast?.open({message:"Conversion Failed", status: false})
                setLoading(false)
            }
        }

        if(selectedPlaylist && isYoutubeLoggedIn==='true' && isYoutubeLoggedIn==='true' && conversionOptions!==''){
            setLoading(true)
            try {
                const youtubeMusicIds = await getYoutubeTracksIds({spotifyMusic:[], spotifyPlaylist: selectedPlaylist})
                console.log(youtubeMusicIds);
                if(conversionOptions==='CreatePlaylist' && youtubeMusicIds && youtubeMusicIds.length>0){
                    const res = await createNewYoutubePlaylist({playlistName});
                    if(res.status===200){
                        const res2 = await addTracksToPlaylist({youtubeMusicIds, id:res.data.id})
                        if(res2.status!==200){
                            toast?.open({message:"Conversion failed", status: false})
                            setLoading(false)
                            return;
                        }
                        toast?.open({message:"Conversion success", status: true})
                        setLoading(false);
                        return;
                    }
                }else if(conversionOptions==='addToExistingPlaylist' && youtubeMusicIds && youtubeMusicIds.length>0){
                    if(selectedConversionPlaylist!==null){
                        const res2 = await addTracksToPlaylist({youtubeMusicIds, id:selectedConversionPlaylist?.id})
                        if(res2.status!==200){
                            toast?.open({message:"Conversion failed", status: false})
                            setLoading(false)
                            return;
                        }
                        toast?.open({message:"Conversion success", status: true})
                        setLoading(false);
                        return;
                    }
                }
            } catch (error) {
                console.log(error);
                toast?.open({message:"Conversion Failed", status: false})
                setLoading(false)
            }
        }
    }
 
    return (
        <>
            {
                loading ?
                <div className={`bg-gradient-to-r from-violet-500 to-violet-800 px-16 py-3 text-3xl font-semibold rounded-b-3xl`}>
                    Loading...
                </div>
                :
                <button
                    onClick={handleConvertion}
                    className={`bg-violet-600 px-16 py-3 text-3xl font-semibold rounded-b-3xl ${isYoutubeLoggedIn==='true' && isSpotifyLoggedIn==='true' && 'hover:bg-violet-600'}`}
                    disabled={(isYoutubeLoggedIn==='false' || isSpotifyLoggedIn==='false')}
                >
                    Convert
                </button>
            }
        </>
    )
}