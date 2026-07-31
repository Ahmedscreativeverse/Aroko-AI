'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useSignup } from '@/lib/auth/auth-hooks'
import { useAuth } from '@/lib/auth/auth-context'
import { toast } from 'sonner'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [termsAccepted, setTermsAccepted] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const signupMutation = useSignup()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    try {
      await signupMutation.mutateAsync({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
      })
      toast.success('Account created! Please check your email to confirm.')
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account')
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
          <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
          <p className="text-muted-foreground">Start creating amazing content with AI</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-border bg-secondary mt-0.5"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
            />
            <span className="text-muted-foreground">
              I agree to the{' '}
              <a href="#" className="text-foreground hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-foreground hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>

          <Button 
            type="submit" 
            size="lg" 
            className="w-full gap-2"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? 'Creating Account...' : 'Create Account'} 
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">or sign up with</span>
          </div>
        </div>

        {/* Social Signup */}
        <div className="grid grid-cols-2 gap-4">
          <Button variant="outline" size="lg">
            Google
          </Button>
          <Button variant="outline" size="lg">
            GitHub
          </Button>
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-foreground hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
