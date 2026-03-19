import type { Bookmark, VideoBookmarks } from '../types';

// Get bookmarks for a specific video
export async function getBookmarks(videoId: string): Promise<VideoBookmarks> {
  return new Promise((resolve) => {
    chrome.storage.sync.get([videoId], (result) => {
      const stored = result[videoId];
      const bookmarks = stored ? JSON.parse(stored as string) : [];
      resolve(bookmarks);
    });
  });
}

// Save bookmarks for a specific video
export async function setBookmarks(videoId: string, bookmarks: VideoBookmarks): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ [videoId]: JSON.stringify(bookmarks) }, resolve);
  });
}

// Add a new bookmark
export async function addBookmark(videoId: string, bookmark: Bookmark): Promise<VideoBookmarks> {
  const bookmarks = await getBookmarks(videoId);
  const updatedBookmarks = [...bookmarks, bookmark].sort((a, b) => a.time - b.time);
  await setBookmarks(videoId, updatedBookmarks);
  return updatedBookmarks;
}

// Delete a bookmark by time
export async function deleteBookmark(videoId: string, time: number): Promise<VideoBookmarks> {
  const bookmarks = await getBookmarks(videoId);
  const updatedBookmarks = bookmarks.filter((b) => b.time !== time);
  await setBookmarks(videoId, updatedBookmarks);
  return updatedBookmarks;
}

// Format time in seconds to HH:MM:SS or MM:SS
export function formatTime(seconds: number): string {
  const date = new Date(0);
  date.setSeconds(seconds);
  const timeStr = date.toISOString().slice(11, 19);
  // Remove leading zeros for hours if less than 1 hour
  return seconds >= 3600 ? timeStr : timeStr.slice(3);
}
