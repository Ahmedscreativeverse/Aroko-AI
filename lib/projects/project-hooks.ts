import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Database } from '@/lib/supabase/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']

const PROJECTS_PAGE_SIZE = 12

export function useProjects(userId: string | null | undefined) {
  return useInfiniteQuery({
    queryKey: ['projects', userId],
    queryFn: async ({ pageParam = 0 }) => {
      const supabase = getSupabaseClient()
      if (!userId) return { projects: [], hasMore: false }

      const { data, error, count } = await supabase
        .from('projects')
        .select('*', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(pageParam * PROJECTS_PAGE_SIZE, (pageParam + 1) * PROJECTS_PAGE_SIZE - 1)

      if (error) throw error

      return {
        projects: data || [],
        hasMore: (count || 0) > (pageParam + 1) * PROJECTS_PAGE_SIZE,
        nextPage: pageParam + 1,
      }
    },
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextPage : undefined),
    enabled: !!userId,
    initialPageParam: 0,
  })
}

export function useProject(projectId: string | null | undefined) {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      if (!projectId) return null

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!projectId,
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      project,
    }: {
      userId: string
      project: Omit<ProjectInsert, 'id' | 'user_id'>
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('projects')
        .insert({
          ...project,
          user_id: userId,
        })
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', variables.userId],
      })
    },
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      projectId,
      updates,
    }: {
      projectId: string
      updates: Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ['project', data.id],
      })
      queryClient.invalidateQueries({
        queryKey: ['projects', data.user_id],
      })
    },
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ projectId, userId }: { projectId: string; userId: string }) => {
      const supabase = getSupabaseClient()
      const { error } = await supabase.from('projects').delete().eq('id', projectId)

      if (error) throw error
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', variables.userId],
      })
    },
  })
}

export function useSearchProjects(userId: string | null | undefined, searchQuery: string) {
  return useQuery({
    queryKey: ['searchProjects', userId, searchQuery],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      if (!userId || !searchQuery.trim()) return []

      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId)
        .ilike('name', `%${searchQuery}%`)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      return data || []
    },
    enabled: !!userId && !!searchQuery.trim(),
  })
}
