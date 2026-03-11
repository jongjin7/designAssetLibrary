export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string
          file_name: string
          file_path: string
          file_size_bytes: number
          mime_type: string
          phash: string | null
          palette: Json | null
          thumbnail_url: string | null
          folder_id: string | null
          user_id: string
          is_favorite: boolean
          metadata: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_path: string
          file_size_bytes: number
          mime_type: string
          phash?: string | null
          palette?: Json | null
          thumbnail_url?: string | null
          folder_id?: string | null
          user_id: string
          is_favorite?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          file_path?: string
          file_size_bytes?: number
          mime_type?: string
          phash?: string | null
          palette?: Json | null
          thumbnail_url?: string | null
          folder_id?: string | null
          user_id?: string
          is_favorite?: boolean
          metadata?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      folders: {
        Row: {
          id: string
          name: string
          parent_id: string | null
          is_smart_folder: boolean
          smart_logic: Json | null
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          parent_id?: string | null
          is_smart_folder?: boolean
          smart_logic?: Json | null
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          parent_id?: string | null
          is_smart_folder?: boolean
          smart_logic?: Json | null
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      tags: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      asset_tags: {
        Row: {
          asset_id: string
          tag_id: string
        }
        Insert: {
          asset_id: string
          tag_id: string
        }
        Update: {
          asset_id?: string
          tag_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
