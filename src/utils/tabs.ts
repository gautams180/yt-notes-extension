// Get the currently active tab
export async function getActiveTabURL(): Promise<chrome.tabs.Tab> {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  return tabs[0];
}

// Extract video ID from YouTube URL
export function getVideoIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('youtube.com')) {
      return urlObj.searchParams.get('v');
    }
  } catch {
    return null;
  }
  return null;
}

// Check if URL is a YouTube video page
export function isYouTubeVideoPage(url: string): boolean {
  return url.includes('youtube.com/watch') && getVideoIdFromUrl(url) !== null;
}
