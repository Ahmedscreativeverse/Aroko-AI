'use client'

export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useLogin } from '@/lib/auth/auth-hooks'
import { useAuth } from '@/lib/auth/auth-context'
import { toast } from 'sonner'

function LoginContent() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { user } = useAuth()
  const loginMutation = useLogin()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await loginMutation.mutateAsync({ email, password })
      toast.success('Signed in successfully')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Aroko<span className="text-xs font-normal opacity-75"> AI</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
          <p className="text-muted-foreground">Sign in to your account to continue creating</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border bg-secondary"
              />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full gap-2"
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? 'Signing in...' : 'Sign In'} 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-semibold text-foreground hover:underline">
            Sign up for free
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

function LoginSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-4 animate-pulse">
        <div className="h-8 bg-card rounded w-24 mx-auto"></div>
        <div className="h-10 bg-card rounded"></div>
        <div className="h-10 bg-card rounded"></div>
        <div className="h-10 bg-card rounded"></div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginContent />
    </Suspense>
  )
}
