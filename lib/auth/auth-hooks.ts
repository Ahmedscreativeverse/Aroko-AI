import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSupabaseClient } from '@/lib/supabase/client'

export function useLogin() {
  return useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      return data
    },
  })
}

export function useSignup() {
  return useMutation({
    mutationFn: async ({
      email,
      password,
      full_name,
    }: {
      email: string
      password: string
      full_name: string
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name,
          },
        },
      })

      if (error) throw error

      // Note: the user_profiles row is created automatically by a DB
      // trigger (see supabase/migrations/002_auto_create_user_profile.sql)
      // as soon as this signUp() call creates the underlying auth.users
      // row - no client-side insert needed here.

      return data
    },
  })
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const supabase = getSupabaseClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) throw error
      return user
    },
  })
}

export function useUserProfile(userId: string | null | undefined) {
  return useQuery({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!userId) return null

      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      updates,
    }: {
      userId: string
      updates: Record<string, any>
    }) => {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] })
    },
  })
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
    },
  })
}

export function useSignOutOtherSessions() {
  return useMutation({
    mutationFn: async () => {
      const supabase = getSupabaseClient()
      const { error } = await supabase.auth.signOut({ scope: 'others' })
      if (error) throw error
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, file }: { userId: string; file: File }) => {
      const supabase = getSupabaseClient()
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath)

      const avatarUrl = `${publicUrl}?t=${Date.now()}`

      const { data, error: updateError } = await supabase
        .from('user_profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId)
        .select()
        .single()

      if (updateError) throw updateError
      return data
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.userId] })
    },
  })
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const supabase = getSupabaseClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        throw new Error('Authentication required')
      }

      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Failed to delete account')
      }

      await supabase.auth.signOut()
    },
  })
}