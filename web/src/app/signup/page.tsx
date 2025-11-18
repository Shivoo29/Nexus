'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, User, Github, MessageCircle, Check, ArrowRight } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [agreed, setAgreed] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would call your API
    console.log('Signup:', formData)
    // Redirect to onboarding
    router.push('/onboarding')
  }

  const handleSocialSignup = (provider: string) => {
    // In a real app, this would initiate OAuth flow
    console.log('Social signup:', provider)
    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column - Benefits */}
          <div className="hidden md:block">
            <h1 className="text-5xl font-display font-bold mb-6">
              Start Coding
              <br />
              <span className="bg-neo-yellow border-4 border-black px-3 py-1 inline-block -rotate-1 neo-shadow">
                Faster Today
              </span>
            </h1>
            <p className="text-xl text-gray-700 mb-8">
              Join thousands of developers building better software with Nexus.
            </p>

            <div className="space-y-4">
              {[
                'Setup in under 2 minutes',
                'No credit card required',
                'Free tier includes full editor',
                'Cancel anytime, no questions asked',
                'Access to community plugins',
                'Priority Discord support',
              ].map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-8 h-8 bg-neo-green border-3 border-black flex items-center justify-center mr-3 neo-shadow-sm">
                    <Check className="w-5 h-5" />
                  </div>
                  <span className="text-lg font-medium">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-neo-cyan border-4 border-black neo-shadow">
              <p className="text-sm text-gray-700">
                <strong>100% Open Source</strong> • MIT License • Your code stays private
              </p>
            </div>
          </div>

          {/* Right Column - Signup Form */}
          <div>
            <Card color="white" className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-3xl font-display font-bold mb-2">Create Account</h2>
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold underline hover:text-neo-pink">
                    Log in
                  </Link>
                </p>
              </div>

              {/* Social Signup */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleSocialSignup('github')}
                  className="w-full flex items-center justify-center px-6 py-3 border-4 border-black bg-neo-black text-white font-bold hover:bg-gray-900 transition-all neo-shadow-sm hover:neo-shadow"
                >
                  <Github className="w-5 h-5 mr-2" />
                  Continue with GitHub
                </button>
                <button
                  onClick={() => handleSocialSignup('discord')}
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

              {/* Email Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block font-bold mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

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
                  <label htmlFor="password" className="block font-bold mb-2">
                    Password
                  </label>
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
                  <p className="mt-2 text-sm text-gray-600">
                    Must be at least 8 characters
                  </p>
                </div>

                <div className="flex items-start">
                  <input
                    id="agree"
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    className="mt-1 w-5 h-5 border-3 border-black"
                    required
                  />
                  <label htmlFor="agree" className="ml-3 text-sm text-gray-700">
                    I agree to the{' '}
                    <Link href="/terms" className="font-bold underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-bold underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <Button type="submit" variant="primary" size="lg" className="w-full text-lg">
                  Create Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>

              <p className="mt-6 text-xs text-center text-gray-500">
                By signing up, you'll receive updates about Nexus. Unsubscribe anytime.
              </p>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 flex justify-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                SOC 2 Certified
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                GDPR Compliant
              </div>
              <div className="flex items-center">
                <Check className="w-4 h-4 mr-1" />
                256-bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
