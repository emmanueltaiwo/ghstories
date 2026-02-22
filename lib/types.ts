export interface Commit {
  id: string;
  userId: string;
  repositoryName: string;
  repositoryFullName: string;
  sha: string;
  message: string;
  authorName: string;
  authorEmail: string;
  url: string;
  createdAt: number;
}

export interface User {
  id: string;
  username: string | null;
  avatarUrl: string | null;
}

export interface Story {
  id: string;
  userId: string;
  commitId: string;
  expiresAt: number;
  viewCount: number;
  isHighlight: boolean;
  createdAt: number;
  updatedAt: number;
  commit: Commit;
  user: User;
}

export interface Reactor {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  displayName: string | null;
}

export interface Reaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
  reactors: Reactor[];
}

export interface StoryViewerRecord {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  displayName: string | null;
  viewedAt: string;
}

export interface ProfileUser {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt: number;
  isFollowing: boolean;
}

export interface HighlightStory {
  id: string;
  userId: string;
  commitId: string;
  createdAt: number;
  expiresAt: number;
  isHighlight: boolean;
  viewCount: number;
  commit: Commit;
}

export type StoryViewerStory = Story | HighlightStory;
