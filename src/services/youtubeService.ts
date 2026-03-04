
export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail: string;
  videoCount: number;
}

const API_KEY = (import.meta as any).env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export const youtubeService = {
  async searchAnimePlaylists(query: string = 'full anime episodes'): Promise<YouTubePlaylist[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/search?part=snippet&q=${encodeURIComponent(query)}&type=playlist&maxResults=12&key=${API_KEY}`
      );
      const data = await response.json();
      
      if (data.error) {
        console.error('YouTube API Error:', data.error);
        return [];
      }

      return data.items.map((item: any) => ({
        id: item.id.playlistId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        videoCount: 0,
      }));
    } catch (error) {
      console.error('Failed to fetch playlists:', error);
      return [];
    }
  },

  async getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.error) {
        console.error('YouTube API Error:', data.error);
        return [];
      }

      return data.items.map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
      }));
    } catch (error) {
      console.error('Failed to fetch playlist videos:', error);
      return [];
    }
  }
};
