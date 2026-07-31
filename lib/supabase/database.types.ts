export type Database = {
  public: {
    Tables: {
     user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          plan: string
          notification_preferences: {
            generation_complete: boolean
            weekly_summary: boolean
            new_features: boolean
            marketing_emails: boolean
          }
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          notification_preferences?: Record<string, boolean>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          notification_preferences?: Record<string, boolean>
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          idea: string
          industry: string | null
          target_audience: string | null
          tone: string | null
          language: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          idea: string
          industry?: string | null
          target_audience?: string | null
          tone?: string | null
          language?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          idea?: string
          industry?: string | null
          target_audience?: string | null
          tone?: string | null
          language?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'projects_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          }
        ]
      }
      project_versions: {
        Row: {
          id: string
          project_id: string
          version_number: number
          content: Record<string, any>
          generation_tokens: number | null
          generation_time_ms: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          version_number: number
          content: Record<string, any>
          generation_tokens?: number | null
          generation_time_ms?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          version_number?: number
          content?: Record<string, any>
          generation_tokens?: number | null
          generation_time_ms?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_versions_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          }
        ]
      }
      generation_history: {
        Row: {
          id: string
          user_id: string
          project_id: string
          version_id: string | null
          prompt_used: string | null
          tokens_used: number | null
          generation_time_ms: number | null
          model_version: string
          status: string
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          version_id?: string | null
          prompt_used?: string | null
          tokens_used?: number | null
          generation_time_ms?: number | null
          model_version?: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          version_id?: string | null
          prompt_used?: string | null
          tokens_used?: number | null
          generation_time_ms?: number | null
          model_version?: string
          status?: string
          error_message?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'generation_history_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'generation_history_project_id_fkey'
            columns: ['project_id']
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'generation_history_version_id_fkey'
            columns: ['version_id']
            referencedRelation: 'project_versions'
            referencedColumns: ['id']
          }
        ]
      }
      exports: {
        Row: {
          id: string
          user_id: string
          version_id: string
          export_format: string
          file_size_bytes: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          version_id: string
          export_format: string
          file_size_bytes?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          version_id?: string
          export_format?: string
          file_size_bytes?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'exports_user_id_fkey'
            columns: ['user_id']
            referencedRelation: 'user_profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'exports_version_id_fkey'
            columns: ['version_id']
            referencedRelation: 'project_versions'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}