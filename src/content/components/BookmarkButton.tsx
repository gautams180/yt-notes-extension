/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

const buttonStyles = css`
  width: 36px;
  height: 36px;
  min-width: 36px;
  cursor: pointer;
  opacity: 0.9;
  transition: opacity 0.2s;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    opacity: 1;
  }

  img {
    width: 100%;
    height: 100%;
  }
`;

interface BookmarkButtonProps {
  onClick: () => void;
  iconUrl: string;
}

export function BookmarkButton({ onClick, iconUrl }: BookmarkButtonProps) {
  return (
    <button
      css={buttonStyles}
      onClick={onClick}
      title="Click to bookmark current timestamp"
      className="ytp-button"
    >
      <img src={iconUrl} alt="Bookmark" />
    </button>
  );
}
