/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useActiveTab, useBookmarks } from '../hooks';
import { BookmarkList } from './components/BookmarkList';

const containerStyles = css`
  width: 280px;
  color: #314d3e;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const titleStyles = css`
  font-size: 14px;
  font-weight: bold;
  padding: 8px;
`;

const messageStyles = css`
  padding: 8px;
  font-style: italic;
  color: #666;
`;

export default function App() {
  const { tab, videoId, isYouTubeVideo, loading: tabLoading } = useActiveTab();
  const { bookmarks, loading: bookmarksLoading, deleteBookmark } = useBookmarks(videoId);

  if (tabLoading) {
    return (
      <div css={containerStyles}>
        <div css={messageStyles}>Loading...</div>
      </div>
    );
  }

  if (!isYouTubeVideo) {
    return (
      <div css={containerStyles}>
        <div css={messageStyles}>
          This is not a YouTube video page.
        </div>
      </div>
    );
  }

  return (
    <div css={containerStyles}>
      <div css={titleStyles}>Your bookmarks for this video</div>
      <BookmarkList
        bookmarks={bookmarks}
        loading={bookmarksLoading}
        onDelete={deleteBookmark}
        onPlay={async (time) => {
          if (tab?.id) {
            await chrome.tabs.sendMessage(tab.id, {
              type: 'PLAY',
              value: time,
            });
          }
        }}
      />
    </div>
  );
}
