/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { Bookmark } from '../../types';

const bookmarkStyles = css`
  display: flex;
  border-bottom: 1px solid #00254d;
  border-radius: 0.8rem;
  padding: 3px;
  padding-bottom: 7px;
  margin-bottom: 7px;
`;

const textContainerStyles = css`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const titleStyles = css`
  padding-left: 2px;
  font-size: 13px;
`;

const noteStyles = css`
  padding-left: 2px;
  font-size: 11px;
  color: #666;
  margin-top: 2px;
  font-style: italic;
`;

const controlsStyles = css`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const iconButtonStyles = css`
  width: 18px;
  height: 18px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
`;

interface BookmarkItemProps {
  bookmark: Bookmark;
  onPlay: () => void;
  onDelete: () => void;
}

export function BookmarkItem({ bookmark, onPlay, onDelete }: BookmarkItemProps) {
  const handleDelete = () => {
    // Play sound effect
    const sound = new Audio(chrome.runtime.getURL('assets/fahh.mp3'));
    sound.play().catch((err) => console.log('Audio play failed:', err));
    onDelete();
  };

  return (
    <div css={bookmarkStyles}>
      <div css={textContainerStyles}>
        <div css={titleStyles}>{bookmark.desc}</div>
        {bookmark.note && bookmark.note.trim() !== '' && (
          <div css={noteStyles}>{bookmark.note}</div>
        )}
      </div>
      <div css={controlsStyles}>
        <img
          css={iconButtonStyles}
          src="assets/play.png"
          alt="Play"
          title="Play"
          onClick={onPlay}
        />
        <img
          css={iconButtonStyles}
          src="assets/delete.png"
          alt="Delete"
          title="Delete"
          onClick={handleDelete}
        />
      </div>
    </div>
  );
}
