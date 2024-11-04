'use client'
import { ConvertButton } from "./ConvertButton";
import { ArrowRightLeft } from "lucide-react";
import { useState } from "react";
import { PlaylistsProps, SpotifyToYoutubeCard, TrackProps } from "./SpotifyToYoutubeCard";
import { YoutubePlaylistProps } from "./YoutubeCard";

interface CardProps {
    isSpotifyLoggedIn: string,
    isYoutubeLoggedIn: string
}

export const Card = ({
    isSpotifyLoggedIn,
    isYoutubeLoggedIn
}: CardProps) => {

    const [spotifyToYoutube, setSpotifyToYoutube] = useState<boolean>(true)
    const [youtubeToSpotify, setYoutubeToSpotify] = useState<boolean>(false)
    const [addPlaylist, setAddPlaylist] = useState<boolean>(true);
    const [playlistName, setPlaylistName] = useState<string>("New Playlist");
    const [selectedPlaylistName, setSelectedPlaylistName] = useState<string| undefined>(undefined);
    const [selectedMusic, setSelectedMusic] = useState<TrackProps[] | []>([]);
    const [selectedPlaylist, setSelectedPlaylists] = useState<PlaylistsProps|null>(null);
    const [conversionOptions, setConversionOption] = useState<''|'AddToLiked'|'CreatePlaylist'|'addToExistingPlaylist'>('')
    const [selectedConversionPlaylist, setSelectedConversionPlaylist] = useState<YoutubePlaylistProps|null>(null);
    const [currentSpotifyCard, setCurrentSpotifyCard] = useState<''|'YourTracks'|'Playlists'>('YourTracks');

    const handleSwitch = () => {
        if(spotifyToYoutube){
            setSpotifyToYoutube(false);
            setYoutubeToSpotify(true);
        }else if(youtubeToSpotify){
            setSpotifyToYoutube(true);
            setYoutubeToSpotify(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-50">
            <div className="relative flex flex-row justify-evenly min-w-[1000px] min-h-[500px] shadow-2xl shadow-black">
            <button
                onClick={handleSwitch}
                className="absolute top-1.5 z-99 bg-gradient-to-r from-violet-500 to-violet-800 text-lg text-black font-semibold px-4 py-1 rounded-xl"
            >
                <ArrowRightLeft />
            </button>
            {
                spotifyToYoutube &&
                <SpotifyToYoutubeCard isSpotifyLoggedIn={isSpotifyLoggedIn} isYoutubeLoggedIn={isYoutubeLoggedIn} addPlaylist={addPlaylist} setAddPlaylist={setAddPlaylist} playlistName={playlistName} setPlaylistName={setPlaylistName} selectedPlaylistName={selectedPlaylistName} setSelectedPlaylistName={setSelectedPlaylistName} selectedMusic={selectedMusic} setSelectedMusic={setSelectedMusic} selectedPlaylist={selectedPlaylist} setSelectedPlaylists={setSelectedPlaylists} conversionOptions={conversionOptions} setConversionOption={setConversionOption} selectedConversionPlaylist={selectedConversionPlaylist} setSelectedConversionPlaylist={setSelectedConversionPlaylist} currentSpotifyCard={currentSpotifyCard} setCurrentSpotifyCard={setCurrentSpotifyCard}/>
            }
            {/* {
                youtubeToSpotify &&
                <YoutubeToSpotifyCard isSpotifyLoggedIn={isSpotifyLoggedIn} isYoutubeLoggedIn={isYoutubeLoggedIn} />
            } */}
            </div>
            <ConvertButton isSpotifyLoggedIn={isSpotifyLoggedIn} isYoutubeLoggedIn={isYoutubeLoggedIn} addPlaylist={addPlaylist} playlistName={playlistName} selectedPlaylistName={selectedPlaylistName} selectedMusic={selectedMusic} selectedPlaylist={selectedPlaylist} conversionOptions={conversionOptions} selectedConversionPlaylist={selectedConversionPlaylist} currentSpotifyCard={currentSpotifyCard}/>
        </div>
    )
}