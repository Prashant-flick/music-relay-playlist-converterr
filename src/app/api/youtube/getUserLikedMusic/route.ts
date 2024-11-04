import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { YoutubeLikedVideoProps } from "@/components/YoutubeCard";

export async function GET(req:NextRequest){
    const cookie = cookies();
    const youtubeAccessToken = cookie.get('youtube-access-token')?.value
    const nextPageToken = req.nextUrl.searchParams.get('nextPageToken') || '';

    if(youtubeAccessToken){
        const res = await axios.get(`https://youtube.googleapis.com/youtube/v3/videos?part=snippet%2CcontentDetails%2Cstatistics&maxResults=50&myRating=like&pageToken=${nextPageToken}`, {
            headers: {
                Authorization: `Bearer ${youtubeAccessToken}`,
            }
        })

        let musicItems = res.data.items
        musicItems = musicItems.filter((item: YoutubeLikedVideoProps) => {
            return item?.snippet?.categoryId==="10"
        })
        const nextPage = res.data.nextPageToken;
        return NextResponse.json({musicItems,nextPageToken:nextPage});
    }else{  
        return NextResponse.json({
            message: "invalid youtube access token"
        })
    }

}