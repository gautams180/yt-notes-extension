/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState, useRef, useEffect } from 'react';

const containerStyles = css`
  position: absolute;
  bottom: 80px;
  left: 20px;
  z-index: 2147483647;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const inputStyles = css`
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  width: 200px;
  outline: none;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &:focus {
    border-color: #66afe9;
    box-shadow: 0 0 4px rgba(102, 175, 233, 0.6);
  }
`;

const iconsRowStyles = css`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`;

const iconStyles = css`
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
  background: none;
  border: none;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const crossIconStyles = css`
  ${iconStyles}
  color: #dc3545;
`;

const checkIconStyles = css`
  ${iconStyles}
  color: #28a745;
`;

interface BookmarkInputPopupProps {
  onSave: (note: string) => void;
  onCancel: () => void;
}

export function BookmarkInputPopup({ onSave, onCancel }: BookmarkInputPopupProps) {
  const [note, setNote] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input when popup opens
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    onSave(note.trim());
    setNote('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation to prevent YouTube from handling keyboard events
    e.stopPropagation();
    
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div 
      css={containerStyles}
      onKeyDown={handleKeyDown}
      onKeyUp={(e) => e.stopPropagation()}
      onKeyPress={(e) => e.stopPropagation()}
    >
      <input
        ref={inputRef}
        css={inputStyles}
        type="text"
        placeholder="Enter note here"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div css={iconsRowStyles}>
        <button css={crossIconStyles} onClick={onCancel} title="Cancel">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button css={checkIconStyles} onClick={handleSave} title="Save bookmark">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
}
