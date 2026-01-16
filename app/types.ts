// Type definitions for KNU Link app

export interface User {
  id?: string; // UUID from Supabase
  studentId: string;
  nickname: string;
  gender: "male" | "female" | "other";
  icon: string;
  joinedActivities?: number[];
}

export interface Post {
  id: number;
  user_id: string;
  nickname: string;
  icon: string;
  activity: string;
  category: string;
  time: string;
  location?: string;
  expiration_date?: string;
  created_at: string;
}

export interface ChatMessage {
  id: number;
  postId: number;
  userId: string;
  nickname: string;
  icon: string;
  message: string;
  timestamp: Date;
  created_at?: string;
}
