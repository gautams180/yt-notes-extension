// Bookmark data structure
export interface Bookmark {
  time: number;
  desc: string;
  note: string;
}

// Video bookmarks storage format
export type VideoBookmarks = Bookmark[];
