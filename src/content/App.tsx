/** @jsxImportSource @emotion/react */
import { useCallback } from 'react';
import { BookmarkInputPopup } from './components/BookmarkInputPopup';
import type { Bookmark } from '../types';
import { addBookmark, formatTime } from '../utils/storage';

interface ContentAppProps {
  videoId: string;
  getVideoPlayer: () => HTMLVideoElement | null;
  onClose: () => void;
}

export function ContentApp({ videoId, getVideoPlayer, onClose }: ContentAppProps) {
  const handleSave = useCallback(async (note: string) => {
    const player = getVideoPlayer();
    if (!player) return;

    const currentTime = player.currentTime;
    const newBookmark: Bookmark = {
      time: currentTime,
      desc: `Bookmark at ${formatTime(currentTime)}`,
      note: note,
    };

    await addBookmark(videoId, newBookmark);
    onClose();
  }, [videoId, getVideoPlayer, onClose]);

  return (
    <BookmarkInputPopup
      onSave={handleSave}
      onCancel={onClose}
    />
  );
}

// Export a function to trigger popup visibility from outside React
export type ContentAppController = {
  togglePopup: () => void;
  showPopup: () => void;
  hidePopup: () => void;
};
