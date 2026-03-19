/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import type { VideoBookmarks } from '../../types';
import { BookmarkItem } from './BookmarkItem';

const bookmarksContainerStyles = css`
  margin: 5px 5px;
  padding: 3px;
`;

const emptyMessageStyles = css`
  font-style: italic;
  color: #666;
  padding: 8px;
`;

interface BookmarkListProps {
  bookmarks: VideoBookmarks;
  loading: boolean;
  onPlay: (time: number) => void;
  onDelete: (time: number) => void;
}

export function BookmarkList({ bookmarks, loading, onPlay, onDelete }: BookmarkListProps) {
  if (loading) {
    return (
      <div css={bookmarksContainerStyles}>
        <div css={emptyMessageStyles}>Loading bookmarks...</div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div css={bookmarksContainerStyles}>
        <div css={emptyMessageStyles}>No bookmarks to show</div>
      </div>
    );
  }

  return (
    <div css={bookmarksContainerStyles}>
      {bookmarks.map((bookmark) => (
        <BookmarkItem
          key={bookmark.time}
          bookmark={bookmark}
          onPlay={() => onPlay(bookmark.time)}
          onDelete={() => onDelete(bookmark.time)}
        />
      ))}
    </div>
  );
}
