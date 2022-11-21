export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface GetPostsResponse {
  created_at: string;
  id: string;
  score: number;
  title: string;
  user_id: string;
  username: string;
}

export interface GetSinglePostWithCommentResponse {
  author_name: string;
  content: string;
  created_at: string;
  id: string;
  path: string;
  score: number;
  title: string;
}

export interface Database {
  public: {
    Tables: {
      post_contents: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          title: string | null;
          content: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          title?: string | null;
          content?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          title?: string | null;
          content?: string | null;
          created_at?: string;
        };
      };
      post_score: {
        Row: {
          post_id: string;
          score: number;
        };
        Insert: {
          post_id: string;
          score: number;
        };
        Update: {
          post_id?: string;
          score?: number;
        };
      };
      post_votes: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          vote_type: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          vote_type: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          user_id?: string;
          vote_type?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          path: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          path: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          path?: unknown;
        };
      };
      user_profiles: {
        Row: {
          user_id: string;
          username: string;
        };
        Insert: {
          user_id: string;
          username: string;
        };
        Update: {
          user_id?: string;
          username?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      _ltree_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      _ltree_gist_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      create_new_comment: {
        Args: { user_id: string; content: string; path: string };
        Returns: boolean;
      };
      create_new_post: {
        Args: { userId: string; title: string; content: string };
        Returns: boolean;
      };
      get_posts: {
        Args: { page_number: number };
        Returns: GetPostsResponse[];
      };
      get_single_post_with_comments: {
        Args: { post_id: string };
        Returns: GetSinglePostWithCommentResponse[];
      };
      lca: {
        Args: { "": unknown };
        Returns: unknown;
      };
      lquery_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      lquery_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      lquery_recv: {
        Args: { "": unknown };
        Returns: unknown;
      };
      lquery_send: {
        Args: { "": unknown };
        Returns: string;
      };
      ltree_compress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_decompress: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_gist_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_gist_options: {
        Args: { "": unknown };
        Returns: undefined;
      };
      ltree_gist_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_recv: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltree_send: {
        Args: { "": unknown };
        Returns: string;
      };
      ltree2text: {
        Args: { "": unknown };
        Returns: string;
      };
      ltxtq_in: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltxtq_out: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltxtq_recv: {
        Args: { "": unknown };
        Returns: unknown;
      };
      ltxtq_send: {
        Args: { "": unknown };
        Returns: string;
      };
      nlevel: {
        Args: { "": unknown };
        Returns: number;
      };
      text2ltree: {
        Args: { "": string };
        Returns: unknown;
      };
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
