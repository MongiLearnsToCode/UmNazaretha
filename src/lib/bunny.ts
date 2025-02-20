import { supabase } from './supabase';

const BUNNY_API_KEY = 'fcf49cb2-d6ee-4555-acd76ac7b76b-b995-4391';
const VIDEO_LIBRARY_ID = '379051';
const CDN_HOSTNAME = 'vz-c7e5ef8e-f81.b-cdn.net';
const TEST_VIDEOS_COLLECTION = '7c9a2ae5-d20b-4ad2-b7c3-1c17b3df70b5';

interface BunnyVideo {
  guid: string;
  title: string;
  length: number;
  collectionId: string;
  thumbnailUrl?: string;
  status: number;
}

export async function fetchBunnyVideos() {
  try {
    const response = await fetch(
      `https://video.bunnycdn.com/library/${VIDEO_LIBRARY_ID}/videos`,
      {
        headers: {
          'AccessKey': BUNNY_API_KEY,
          'accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Failed to fetch videos: ${errorData.message || response.statusText}`
      );
    }

    const data = await response.json();
    
    // Ensure we have an array of videos
    const videos: BunnyVideo[] = Array.isArray(data) ? data : data.items || [];
    
    if (videos.length === 0) {
      throw new Error('No videos found in the library');
    }

    // Only return ready videos (status === 4)
    return videos.filter(video => 
      video && 
      typeof video === 'object' && 
      'status' in video && 
      video.status === 4
    );
  } catch (error) {
    console.error('Error fetching Bunny.net videos:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to connect to Bunny.net. Please check your internet connection and try again.'
    );
  }
}

export async function syncBunnyVideos() {
  try {
    const videos = await fetchBunnyVideos();
    
    if (!Array.isArray(videos)) {
      throw new Error('Invalid response format from Bunny.net');
    }

    const testVideos = videos.filter(video => 
      video && 
      typeof video === 'object' && 
      'collectionId' in video && 
      video.collectionId === TEST_VIDEOS_COLLECTION
    );

    if (testVideos.length === 0) {
      throw new Error('No videos found in the test_videos collection');
    }

    let syncedCount = 0;
    const errors: string[] = [];

    for (const video of testVideos) {
      try {
        // Format duration from seconds to HH:MM:SS
        const duration = new Date(video.length * 1000).toISOString().substr(11, 8);
        
        // Check if video already exists in shows table
        const { data: existingShows, error: queryError } = await supabase
          .from('shows')
          .select('id')
          .eq('video_path', video.guid);

        if (queryError) {
          throw queryError;
        }

        // Only insert if no matching show exists
        if (!existingShows || existingShows.length === 0) {
          const { error: insertError } = await supabase
            .from('shows')
            .insert([
              {
                title: video.title,
                description: '',
                duration,
                video_path: video.guid,
                thumbnail_url: video.thumbnailUrl || null
              }
            ]);

          if (insertError) throw insertError;
          syncedCount++;
        }
      } catch (err) {
        errors.push(`Failed to sync video ${video.title}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      throw new Error(`Sync completed with errors:\n${errors.join('\n')}`);
    }

    return { syncedCount, totalVideos: testVideos.length };
  } catch (error) {
    console.error('Error syncing videos:', error);
    throw error instanceof Error ? error : new Error('Failed to sync videos');
  }
}

export function getBunnyStreamUrl(videoId: string): string {
  return `https://${CDN_HOSTNAME}/${videoId}/playlist.m3u8`;
}