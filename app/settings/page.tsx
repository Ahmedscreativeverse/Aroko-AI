'use client'

export const dynamic = 'force-dynamic'

import { DashboardLayout } from '@/components/dashboard-layout'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronRight, Bell, Lock, User, Trash2, LogOut } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/auth-context'
import {
  useDeleteAccount,
  useLogout,
  useSignOutOtherSessions,
  useUpdatePassword,
  useUpdateProfile,
  useUploadAvatar,
  useUserProfile,
} from '@/lib/auth/auth-hooks'

const NOTIFICATION_ITEMS: { key: string; title: string; description: string }[] = [
  {
    key: 'generation_complete',
    title: 'Generation Complete',
    description: 'Get notified when your content is ready',
  },
  {
    key: 'weekly_summary',
    title: 'Weekly Summary',
    description: 'Receive a summary of your weekly activity',
  },
  {
    key: 'new_features',
    title: 'New Features',
    description: 'Learn about new features and updates',
  },
  {
    key: 'marketing_emails',
    title: 'Marketing Emails',
    description: 'Receive special offers and promotions',
  },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('account')
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [authLoading, user, router])

  const { data: profile } = useUserProfile(user?.id)
  const updateProfile = useUpdateProfile()
  const uploadAvatar = useUploadAvatar()
  const updatePassword = useUpdatePassword()
  const signOutOthers = useSignOutOtherSessions()
  const deleteAccount = useDeleteAccount()
  const logout = useLogout()

  const [fullName, setFullName] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
    }
  }, [profile])

  const displayEmail = user?.email || ''
  const initials = (fullName || displayEmail || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ]

  const handleSaveProfile = async () => {
    if (!user) return
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: { full_name: fullName },
      })
      toast.success('Profile updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update profile')
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return
    try {
      await uploadAvatar.mutateAsync({ userId: user.id, file })
      toast.success('Profile picture updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload picture')
    } finally {
      e.target.value = ''
    }
  }

  const handleToggleNotification = async (key: string, value: boolean) => {
    if (!user || !profile) return
    try {
      await updateProfile.mutateAsync({
        userId: user.id,
        updates: {
          notification_preferences: {
            ...profile.notification_preferences,
            [key]: value,
          },
        },
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update preference')
    }
  }

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await updatePassword.mutateAsync({ password: newPassword })
      toast.success('Password updated')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update password')
    }
  }

  const handleSignOutOthers = async () => {
    try {
      await signOutOthers.mutateAsync()
      toast.success('Signed out of all other sessions')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign out other sessions')
    }
  }

  const handleLogout = async () => {
    try {
      await logout.mutateAsync()
      router.push('/')
    } catch (error) {
      toast.error('Failed to logout')
    }
  }

  const handleDeleteAccount = async () => {
    if (!deleteConfirmOpen) {
      setDeleteConfirmOpen(true)
      return
    }
    try {
      await deleteAccount.mutateAsync()
      toast.success('Account deleted')
      router.push('/')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account')
    }
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Tabs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="lg:col-span-1"
            >
              <div className="space-y-2 rounded-xl border border-border bg-card p-4">
                {tabs.map((tab) => {
                  const Icon = tab.icon

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-foreground text-background'
                          : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5" />
                        <span>{tab.label}</span>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  )
                })}
              </div>

              {/* Danger Zone */}
              <div className="mt-6 rounded-xl border border-border/50 bg-card p-4 space-y-2">
                <button
                  onClick={handleLogout}
                  disabled={logout.isPending}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="h-5 w-5" />
                    <span>{logout.isPending ? 'Logging out...' : 'Logout'}</span>
                  </div>
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteAccount.isPending}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Trash2 className="h-5 w-5" />
                    <span>
                      {deleteAccount.isPending
                        ? 'Deleting...'
                        : deleteConfirmOpen
                        ? 'Click again to confirm'
                        : 'Delete Account'}
                    </span>
                  </div>
                </button>
                {deleteConfirmOpen && !deleteAccount.isPending && (
                  <p className="px-4 text-xs text-muted-foreground">
                    This permanently deletes your account and all projects. This cannot be
                    undone.{' '}
                    <button
                      onClick={() => setDeleteConfirmOpen(false)}
                      className="underline underline-offset-2"
                    >
                      Cancel
                    </button>
                  </p>
                )}
              </div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="lg:col-span-3"
            >
              {/* Account Settings */}
              {activeTab === 'account' && (
                <div className="space-y-6">
                  {/* Profile Section */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Profile Information</h3>

                    <div className="space-y-6">
                      {/* Avatar */}
                      <div>
                        <label className="block text-sm font-medium mb-3">Profile Picture</label>
                        <div className="flex items-center gap-4">
                          <div className="h-20 w-20 rounded-full bg-secondary border-2 border-border flex items-center justify-center overflow-hidden">
                            {profile?.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={profile.avatar_url}
                                alt="Profile"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl font-semibold">{initials}</span>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadAvatar.isPending}
                          >
                            {uploadAvatar.isPending ? 'Uploading...' : 'Change Picture'}
                          </Button>
                        </div>
                      </div>

                      {/* Full Name */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                      </div>

                      {/* Email */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Email Address</label>
                        <Input type="email" value={displayEmail} disabled />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contact support to change your email address.
                        </p>
                      </div>

                      <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </div>

                  {/* Workspace Section */}
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Workspace</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Plan</label>
                        <div className="px-4 py-3 rounded-lg bg-secondary text-sm font-medium capitalize">
                          {profile?.plan || 'free'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Notification Preferences</h3>

                    <div className="space-y-4">
                      {NOTIFICATION_ITEMS.map((item) => (
                        <div
                          key={item.key}
                          className="flex items-center justify-between p-4 rounded-lg border border-border/50 hover:border-border transition-colors"
                        >
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <input
                            type="checkbox"
                            checked={profile?.notification_preferences?.[item.key] ?? false}
                            onChange={(e) => handleToggleNotification(item.key, e.target.checked)}
                            className="w-5 h-5 rounded border-border bg-secondary cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <div className="rounded-xl border border-border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-6">Security Settings</h3>

                    <div className="space-y-6">
                      {/* Password */}
                      <div>
                        <h4 className="font-medium mb-3">Change Password</h4>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              New Password
                            </label>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              Confirm Password
                            </label>
                            <Input
                              type="password"
                              placeholder="••••••••"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </div>
                          <Button
                            onClick={handleUpdatePassword}
                            disabled={updatePassword.isPending}
                          >
                            {updatePassword.isPending ? 'Updating...' : 'Update Password'}
                          </Button>
                        </div>
                      </div>

                      {/* Two Factor Auth */}
                      <div className="border-t border-border/50 pt-6">
                        <h4 className="font-medium mb-3">Two-Factor Authentication</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="outline" disabled>
                          Coming soon
                        </Button>
                      </div>

                      {/* Sessions */}
                      <div className="border-t border-border/50 pt-6">
                        <h4 className="font-medium mb-3">Sessions</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Sign out of this account on all other devices/browsers. This device
                          stays signed in.
                        </p>
                        <Button
                          variant="outline"
                          onClick={handleSignOutOthers}
                          disabled={signOutOthers.isPending}
                        >
                          {signOutOthers.isPending
                            ? 'Signing out...'
                            : 'Sign Out of Other Sessions'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}