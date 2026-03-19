import React from 'react';
import ReactDOM from 'react-dom/client';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { BookmarkInputPopup } from './components/BookmarkInputPopup';
import type { Bookmark, ExtensionMessage, VideoBookmarks } from '../types';
import { getBookmarks, addBookmark, formatTime } from '../utils/storage';

// State
let currentVideo = '';
let currentVideoBookmarks: VideoBookmarks = [];
let wasPlaying = false;
let popupRoot: ReactDOM.Root | null = null;
let isPopupVisible = false;

// DOM references
let youtubePlayer: HTMLVideoElement | null = null;
let bookmarkInputContainer: HTMLElement | null = null;
let shadowRoot: ShadowRoot | null = null;
let emotionCache: ReturnType<typeof createCache> | null = null;

// Listen for messages from popup and background
chrome.runtime.onMessage.addListener((message: ExtensionMessage, _sender, sendResponse) => {
  if (message.type === 'NEW') {
    currentVideo = message.videoId;
    newVideoLoaded();
  } else if (message.type === 'PLAY') {
    if (youtubePlayer) {
      youtubePlayer.currentTime = message.value;
    }
  } else if (message.type === 'DELETE') {
    currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time !== message.value);
    chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });
    sendResponse(currentVideoBookmarks);
  }
  return true; // Keep message channel open for async response
});

// Initialize when a new video loads
async function newVideoLoaded() {
  const bookmarkBtnExists = document.getElementsByClassName('bookmark-btn')[0];
  currentVideoBookmarks = await getBookmarks(currentVideo);

  if (!bookmarkBtnExists) {
    initializeUI();
  }
}

// Initialize the bookmark UI
function initializeUI() {
  const moviePlayer = document.getElementById('movie_player');
  const youtubeLeftControls = document.getElementsByClassName('ytp-left-controls')[0];
  youtubePlayer = document.getElementsByClassName('video-stream')[0] as HTMLVideoElement;

  if (!moviePlayer || !youtubeLeftControls || !youtubePlayer) {
    console.log('YouTube player elements not found, retrying...');
    setTimeout(initializeUI, 1000);
    return;
  }

  // Create Shadow DOM container for React popup
  createPopupContainer(moviePlayer);

  // Create bookmark button (vanilla DOM for YouTube controls compatibility)
  const bookmarkBtn = document.createElement('img');
  bookmarkBtn.src = chrome.runtime.getURL('assets/bookmark.png');
  bookmarkBtn.className = 'ytp-button bookmark-btn';
  bookmarkBtn.title = 'Click to bookmark current timestamp';
  bookmarkBtn.style.width = '36px';
  bookmarkBtn.style.height = '36px';
  bookmarkBtn.style.padding = '8px';
  bookmarkBtn.style.cursor = 'pointer';

  youtubeLeftControls.appendChild(bookmarkBtn);

  bookmarkBtn.addEventListener('click', togglePopup);
}

// Create Shadow DOM container for React popup
function createPopupContainer(parentElement: HTMLElement) {
  // Create host element
  const hostElement = document.createElement('div');
  hostElement.id = 'yt-bookmark-popup-host';
  parentElement.appendChild(hostElement);

  // Create shadow root
  shadowRoot = hostElement.attachShadow({ mode: 'open' });

  // Create container for React
  bookmarkInputContainer = document.createElement('div');
  bookmarkInputContainer.id = 'yt-bookmark-popup-root';
  shadowRoot.appendChild(bookmarkInputContainer);

  // Create Emotion cache for shadow DOM
  emotionCache = createCache({
    key: 'ytbm',
    container: shadowRoot,
  });
}

// Toggle popup visibility
function togglePopup() {
  if (isPopupVisible) {
    hidePopup();
  } else {
    showPopup();
  }
}

// Show popup
function showPopup() {
  if (!bookmarkInputContainer || !shadowRoot || !emotionCache) return;

  wasPlaying = youtubePlayer ? !youtubePlayer.paused : false;
  if (youtubePlayer) {
    youtubePlayer.pause();
  }

  isPopupVisible = true;
  renderPopup();
}

// Hide popup
function hidePopup() {
  isPopupVisible = false;
  
  if (popupRoot) {
    popupRoot.unmount();
    popupRoot = null;
  }

  if (wasPlaying && youtubePlayer) {
    youtubePlayer.play();
  }
}

// Save bookmark and close popup
async function handleSave(note: string) {
  if (!youtubePlayer) return;

  const currentTime = youtubePlayer.currentTime;
  const newBookmark: Bookmark = {
    time: currentTime,
    desc: `Bookmark at ${formatTime(currentTime)}`,
    note: note,
  };

  currentVideoBookmarks = await addBookmark(currentVideo, newBookmark);
  hidePopup();
}

// Render React popup into Shadow DOM
function renderPopup() {
  if (!bookmarkInputContainer || !emotionCache) return;

  if (!popupRoot) {
    popupRoot = ReactDOM.createRoot(bookmarkInputContainer);
  }

  popupRoot.render(
    <React.StrictMode>
      <CacheProvider value={emotionCache}>
        <BookmarkInputPopup
          onSave={handleSave}
          onCancel={hidePopup}
        />
      </CacheProvider>
    </React.StrictMode>
  );
}
