'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Github, MessageCircle, ArrowRight, Zap } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would authenticate with your backend
    console.log('Login:', formData)
    // Redirect to dashboard
    router.push('/dashboard')
  }

  const handleSocialLogin = (provider: string) => {
    // In a real app, this would initiate OAuth flow
    console.log('Social login:', provider)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Branding */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-neo-yellow border-4 border-black flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <span className="text-4xl font-display font-bold">Nexus</span>
            </div>

            <h1 className="text-5xl font-display font-bold mb-6">
              Welcome Back!
            </h1>

            <p className="text-xl text-gray-700 mb-8">
              Continue building amazing software with the fastest code editor on the planet.
            </p>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neo-cyan border-3 border-black flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Lightning Fast</p>
                  <p className="text-sm text-gray-600">Sub-1ms input latency</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neo-pink border-3 border-black flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">AI Powered</p>
                  <p className="text-sm text-gray-600">Multi-LLM support</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neo-green border-3 border-black flex items-center justify-center mr-4">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold">Discord Native</p>
                  <p className="text-sm text-gray-600">Code together seamlessly</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Login Form */}
          <div>
            <Card color="white" className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold mb-2">Log In</h2>
                <p className="text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/signup" className="font-bold underline hover:text-neo-pink">
                    Sign up for free
                  </Link>
                </p>
              </div>

              {/* Social Login */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialLogin('github')}
                  className="w-full flex items-center justify-center px-6 py-3 border-4 border-black bg-neo-black text-white font-bold hover:bg-gray-900 transition-all neo-shadow-sm hover:neo-shadow"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </button>
                <button
                  onClick={() => handleSocialLogin('discord')}
                  className="w-full flex items-center justify-center px-6 py-3 border-4 border-black bg-neo-purple text-white font-bold hover:bg-purple-600 transition-all neo-shadow-sm hover:neo-shadow"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Continue with Discord
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white font-bold text-gray-500">OR</span>
                </div>
              </div>

              {/* Email Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block font-bold mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0 transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block font-bold">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-bold hover:underline hover:text-neo-pink"
                    >
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                    className="w-5 h-5 border-3 border-black"
                  />
                  <label htmlFor="remember" className="ml-3 text-sm font-medium">
                    Remember me for 30 days
                  </label>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full text-lg">
                  Log In
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="font-bold underline">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="font-bold underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </Card>

            {/* Help Text */}
            <div className="mt-6 text-center">
              <Card color="cyan" className="max-w-md mx-auto">
                <p className="text-sm">
                  <strong>New to Nexus?</strong> Get started in under 2 minutes with our{' '}
                  <Link href="/docs/quickstart" className="font-bold underline">
                    Quick Start Guide
                  </Link>
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
