import { PlaylistsProps, TrackProps } from "@/components/SpotifyToYoutubeCard";
import axios from "axios";

interface getYoutubeTracksIdsProps {
    spotifyMusic: TrackProps[] | [],
    spotifyPlaylist: PlaylistsProps | null
}

interface addToYoutubeLikedMusicProps {
    youtubeMusicIds: string[]
}

interface playlistItemsProps {
    next: string,
    total: number,
    items: [
        {
            track: {
                album: {
                    name: string
                },
                artists: [
                    {
                        name: string
                    }
                ],
                name: string
            }
        }
    ]
}

interface createNewYoutubePlaylistProps {
    playlistName: string,
}

interface addTracksToPlaylistProps {
    youtubeMusicIds: string[],
    id: string,
}

export const getYoutubeTracksIds = async({
    spotifyMusic,
    spotifyPlaylist
}: getYoutubeTracksIdsProps) => {
    const accessToken = await axios.get('http://localhost:3000/api/getAccessTokens')
    const { youtubeAccessToken, spotifyAccessToken } = accessToken.data
    
    const youtubeVideosIds: string[] = [];
    
    if(spotifyMusic && spotifyMusic.length>0 && youtubeAccessToken){
        try {
            await Promise.all(
                spotifyMusic.map(async (elem) => {
                    const name = `${elem.track.name} by ${elem.track.album?.artists[0]?.name}`
                    const url = `https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults=5&q=${encodeURIComponent(name)}&type=video`;
                    const res = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${youtubeAccessToken}`,
                        },
                    });
                    
                    if (res.data?.items?.length > 0) {
                        youtubeVideosIds.push(res.data.items[0].id.videoId);
                    }
                })
            );
        } catch (error) {
            console.error("Error fetching video IDs:", error);
            return [];
        }
    }else if(spotifyPlaylist && spotifyAccessToken && youtubeAccessToken){
        try {
            if(spotifyPlaylist.name === 'liked songs'){
                let playlistItems: TrackProps[] = []
                let nextPageTrackUrl = '';
                while(nextPageTrackUrl!==null){
                    const res = await axios.get('/api/spotify/getUserTracks', {
                        params: {
                            nextPageUrl: nextPageTrackUrl
                        }
                    });
                    playlistItems = [...playlistItems, ...res?.data?.items]
                    nextPageTrackUrl = res?.data?.next;
                }

                

                if(playlistItems && playlistItems.length>0){
                    const playlistName = "New Playlist";
                    const res1 = await createNewYoutubePlaylist({playlistName});

                    await Promise.all(
                        playlistItems?.map(async (elem) => {
                            const name = `${elem.track.name} by ${elem.track.album.artists[0].name}|${elem.track.album.name}|Song`
                            const url = `https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults=1&q=${encodeURIComponent(name)}&type=video&videoCategoryId=10`;
                            const res = await axios.get(url, {
                                headers: {
                                    Authorization: `Bearer ${youtubeAccessToken}`,
                                },
                            });
                            if (res.data?.items?.length > 0) {
                                const url1 = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet`; 
                                const data = {
                                    snippet: {
                                        playlistId: res1.data.id,
                                        resourceId: {
                                            videoId: res.data.items[0].id.videoId,
                                            kind: "youtube#video",
                                        }
                                    }
                                };
                                console.log(res.data.items[0].id.videoId);
                                await axios.post(url1, data, {
                                    headers: {
                                        Authorization: `Bearer ${youtubeAccessToken}`,
                                        Accept: 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                });
                            }
                        })
                    );
                }
                
            }else{
                const res = await axios.get(`https://api.spotify.com/v1/playlists/${spotifyPlaylist.id}/tracks`, {
                    headers: {
                        Authorization: `Bearer ${spotifyAccessToken}`,
                    },
                })
    
                const playlistItems: playlistItemsProps = res.data
    
                if(playlistItems && playlistItems.items.length>0){
                    await Promise.all(
                        playlistItems?.items.map(async (elem) => {
                            const name = `${elem.track.name} by ${elem.track.artists[0].name}|${elem.track.album.name}|Song`
                            const url = `https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults=1&q=${encodeURIComponent(name)}&type=video&videoCategoryId=10`;
                            const res = await axios.get(url, {
                                headers: {
                                    Authorization: `Bearer ${youtubeAccessToken}`,
                                },
                            });
                            if (res.data?.items?.length > 0) {
                                youtubeVideosIds.push(res.data.items[0].id.videoId);
                            }
                        })
                    );
                }
            }
        } catch (error) {
            console.error("Error fetching video IDs:", error);
            return [];
        }
    }else{
        console.error("Selected Music is empty or not logged in to Youtube");
    }

    return youtubeVideosIds;
}

export const addToYoutubeLikedMusic = async({
    youtubeMusicIds
}: addToYoutubeLikedMusicProps) => {
    const accessToken = await axios.get('http://localhost:3000/api/getAccessTokens')
    const { youtubeAccessToken } = accessToken.data

    if(youtubeMusicIds && youtubeMusicIds.length>0 && youtubeAccessToken){
        try {
            await Promise.all(
                youtubeMusicIds.map(async(elem) => {
                    const url = `https://youtube.googleapis.com/youtube/v3/videos/rate?id=${elem}&rating=like`
                    await axios.post(url, null, {
                        headers: {
                            Authorization: `Bearer ${youtubeAccessToken}`,
                            Accept: 'applicaton/json'
                        }
                    })
                })
            )
        } catch (error) {
            console.error("adding to youtube like music failed", error)
            return {
                status: 400,
                message: error
            }
        }
    }else{
        console.error("Music Ids is empty or not logged in to Youtube");
        return {
            status: 400,
            message: "Music Ids is empty or not logged in to Youtube"
        }
    }

    return {
        status: 200,
        message: "successfully converted into youtube music"
    }
}

export const createNewYoutubePlaylist = async({
    playlistName
}: createNewYoutubePlaylistProps) => {
    const accessToken = await axios.get('http://localhost:3000/api/getAccessTokens')
    const { youtubeAccessToken } = accessToken.data

    try {
        const res = await axios.post('https://youtube.googleapis.com/youtube/v3/playlists?part=id&part=snippet', {
            "snippet" : {
                "title": `${playlistName}`
            }
        }, {
            headers: {
                Authorization: `Bearer ${youtubeAccessToken}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
    
        return {
            status: 200,
            data: res.data,
        }
    } catch (error) {
        return {
            status: 400,
            error: error
        }
    }
}

export const addTracksToPlaylist = async({
    youtubeMusicIds,
    id,
}: addTracksToPlaylistProps) => {
    const accessToken = await axios.get('http://localhost:3000/api/getAccessTokens')
    const { youtubeAccessToken } = accessToken.data    

    if(youtubeMusicIds && youtubeMusicIds.length>0 && youtubeAccessToken){
        try {
            const url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet`;            
            for(let i=0; i<youtubeMusicIds.length; i++){
                console.log(youtubeMusicIds[i]);
                const data = {
                    snippet: {
                        playlistId: id,
                        resourceId: {
                            videoId: youtubeMusicIds[i],
                            kind: "youtube#video",
                        }
                    }
                };
                await axios.post(url, data, {
                    headers: {
                        Authorization: `Bearer ${youtubeAccessToken}`,
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

                new Promise(resolve => setTimeout(resolve, 500));
            }
                
            return {
                status: 200,
                message: "conversion successfull"
            };
        } catch (error) {
            return {
                status: 400,
                error: error
            }
        }
    }else{
        return {
            status: 400,
            message: "Music Ids is empty or not logged in to Youtube"
        }
    }
}