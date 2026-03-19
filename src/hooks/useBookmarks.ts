import { useState, useEffect, useCallback } from 'react';
import type { Bookmark, VideoBookmarks } from '../types';
import { getBookmarks } from '../utils/storage';
import { sendToContentScript } from '../utils/messaging';
import { getActiveTabURL } from '../utils/tabs';

interface UseBookmarksResult {
  bookmarks: VideoBookmarks;
  loading: boolean;
  error: string | null;
  deleteBookmark: (time: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useBookmarks(videoId: string | null): UseBookmarksResult {
  const [bookmarks, setBookmarks] = useState<VideoBookmarks>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookmarks = useCallback(async () => {
    if (!videoId) {
      setBookmarks([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getBookmarks(videoId);
      setBookmarks(data);
    } catch (err) {
      setError('Failed to load bookmarks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [videoId]);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const deleteBookmark = useCallback(async (time: number) => {
    if (!videoId) return;

    try {
      const activeTab = await getActiveTabURL();
      if (!activeTab.id) return;

      // Remove from local state immediately for responsiveness
      setBookmarks((prev) => prev.filter((b) => b.time !== time));

      // Send delete message to content script
      const updatedBookmarks = await sendToContentScript<Bookmark[]>(activeTab.id, {
        type: 'DELETE',
        value: time,
      });

      // Update with response from content script if available
      if (updatedBookmarks) {
        setBookmarks(updatedBookmarks);
      }
    } catch (err) {
      console.error('Failed to delete bookmark:', err);
      // Refresh to restore correct state on error
      await fetchBookmarks();
    }
  }, [videoId, fetchBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    deleteBookmark,
    refresh: fetchBookmarks,
  };
}
