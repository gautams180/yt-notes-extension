import { useState, useEffect } from 'react';
import { getActiveTabURL, getVideoIdFromUrl, isYouTubeVideoPage } from '../utils/tabs';

interface UseActiveTabResult {
  tab: chrome.tabs.Tab | null;
  videoId: string | null;
  isYouTubeVideo: boolean;
  loading: boolean;
}

export function useActiveTab(): UseActiveTabResult {
  const [tab, setTab] = useState<chrome.tabs.Tab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActiveTab = async () => {
      try {
        const activeTab = await getActiveTabURL();
        setTab(activeTab);
      } catch (error) {
        console.error('Failed to get active tab:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveTab();
  }, []);

  const url = tab?.url || '';
  const videoId = getVideoIdFromUrl(url);
  const isYouTubeVideo = isYouTubeVideoPage(url);

  return {
    tab,
    videoId,
    isYouTubeVideo,
    loading,
  };
}
