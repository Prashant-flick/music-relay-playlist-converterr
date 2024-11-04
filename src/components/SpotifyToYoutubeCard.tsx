'use client'
import { Dispatch, SetStateAction, useState } from "react";
import { SpotifyCard} from "./SpotifyCard"
import { SpotifyTrackSelectionCard } from "./SpotifyTrackSelectionCard";
import { YoutubePlaylistProps } from "./YoutubeCard";

export interface TrackProps {
    track: {
        name: string,
        album: {
            images: [
                {
                    url: string,
                }
            ],
            name: string,
            artists: [
                {
                    name: string
                }
            ]
        }
    },
}

export interface PlaylistsProps {
    images: [
        {
            url: string,
        }
    ],
    name: string,
    tracks: {
        total: number
    },
    id: string,
}

interface SpotifyToYoutubeCardProps {
    isSpotifyLoggedIn: string,
    isYoutubeLoggedIn: string,
    addPlaylist: boolean,
    setAddPlaylist: Dispatch<SetStateAction<boolean>>,
    playlistName: string,
    setPlaylistName: Dispatch<SetStateAction<string>>,
    selectedPlaylistName: string | undefined,
    setSelectedPlaylistName: Dispatch<SetStateAction<string | undefined>>,
    selectedMusic: TrackProps[]|[],
    setSelectedMusic: Dispatch<SetStateAction<TrackProps[]|[]>>,
    selectedPlaylist: PlaylistsProps|null,
    setSelectedPlaylists: Dispatch<SetStateAction<PlaylistsProps|null>>,
    conversionOptions: ''|'AddToLiked'|'CreatePlaylist'|'addToExistingPlaylist',
    setConversionOption: Dispatch<SetStateAction<''|'AddToLiked'|'CreatePlaylist'|'addToExistingPlaylist'>>,
    selectedConversionPlaylist: YoutubePlaylistProps | null,
    setSelectedConversionPlaylist: Dispatch<SetStateAction<YoutubePlaylistProps|null>>,
    currentSpotifyCard: ''|'YourTracks'|'Playlists',
    setCurrentSpotifyCard: Dispatch<SetStateAction<''|'YourTracks'|'Playlists'>>,
}

export const SpotifyToYoutubeCard = ({
    isSpotifyLoggedIn,
    isYoutubeLoggedIn,
    addPlaylist,
    setAddPlaylist,
    playlistName,
    setPlaylistName,
    selectedPlaylistName,
    setSelectedPlaylistName,
    selectedMusic,
    setSelectedMusic,
    selectedPlaylist,
    setSelectedPlaylists,
    conversionOptions,
    setConversionOption,
    selectedConversionPlaylist,
    setSelectedConversionPlaylist,
    currentSpotifyCard,
    setCurrentSpotifyCard,
}: SpotifyToYoutubeCardProps) => {
    const [userTracks, setUserTracks] = useState<TrackProps[] | null>(null);
    const [userPlaylists, setUserPlaylists] = useState<PlaylistsProps[] | null>(null);

    return (
        <>
            <SpotifyCard isSpotifyLoggedIn={isSpotifyLoggedIn} userTracks={userTracks} setUserTracks={setUserTracks} userPlaylists={userPlaylists} setUserPlaylists={setUserPlaylists} selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic} selectedPlaylist={selectedPlaylist} setSelectedPlaylists={setSelectedPlaylists} currentSpotifyCard={currentSpotifyCard} setCurrentSpotifyCard={setCurrentSpotifyCard}/>

            <SpotifyTrackSelectionCard isSpotifyLoggedIn={isSpotifyLoggedIn} isYoutubeLoggedIn={isYoutubeLoggedIn} userTracks={userTracks} userPlaylists={userPlaylists} selectedMusic={selectedMusic} selectedPlaylist={selectedPlaylist} addPlaylist={addPlaylist} setAddPlaylist={setAddPlaylist} playlistName={playlistName} setPlaylistName={setPlaylistName} selectedPlaylistName={selectedPlaylistName} setSelectedPlaylistName={setSelectedPlaylistName} conversionOptions={conversionOptions} setConversionOption={setConversionOption} selectedConversionPlaylist={selectedConversionPlaylist} setSelectedConversionPlaylist={setSelectedConversionPlaylist} currentSpotifyCard={currentSpotifyCard} setCurrentSpotifyCard={setCurrentSpotifyCard}/>
        </>
    )
}