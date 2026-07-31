import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'

type ProjectVersion = Database['public']['Tables']['project_versions']['Row']
type GenerationHistory = Database['public']['Tables']['generation_history']['Row']

export interface GenerateContentParams {
  projectId: string
  idea: string
  industry: string
  targetAudience: string
  tone: string
}

export function useGenerateContent() {
  const queryClient = useQueryClient()

  return useMutation({
    retry: (failureCount, error) => {
      const message = error instanceof Error ? error.message : ''
      const isNetworkError = message === 'Network error' || message === 'Backend unavailable'
      return isNetworkError && failureCount < 2
    },
    mutationFn: async (params: GenerateContentParams) => {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Authentication required')
      }

      let response: Response
      try {
        response = await fetch('/api/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(params),
        })
      } catch {
        throw new Error('Network error')
      }

      if (response.status === 401) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Session expired')
      }

      if (response.status >= 500) {
        throw new Error('Backend unavailable')
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Generation failed')
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ['projectVersions', variables.projectId],
      })
      queryClient.invalidateQueries({
        queryKey: ['project', variables.projectId],
      })
    },
  })
}

export function useProjectVersions(projectId: string | null | undefined) {
  return useQuery({
    queryKey: ['projectVersions', projectId],
    queryFn: async () => {
      if (!projectId) return []

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('project_id', projectId)
        .order('version_number', { ascending: false })

      if (error) throw error
      return data || []
    },
    enabled: !!projectId,
  })
}

export function useProjectVersion(versionId: string | null | undefined) {
  return useQuery({
    queryKey: ['projectVersion', versionId],
    queryFn: async () => {
      if (!versionId) return null

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('project_versions')
        .select('*')
        .eq('id', versionId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!versionId,
  })
}

export function useGenerationHistory(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['generationHistory', userId],
    queryFn: async () => {
      if (!userId) return []

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('generation_history')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data || []
    },
    enabled: !!userId,
  })
}

export function useUpdateProjectVersionContent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      versionId,
      content,
    }: {
      versionId: string
      content: Record<string, any>
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('project_versions')
        .update({ content })
        .eq('id', versionId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['projectVersion', data.id],
      })
    },
  })
}
