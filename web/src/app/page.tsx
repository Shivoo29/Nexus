'use client'

import Link from 'next/link'
import {
  Zap,
  Brain,
  MessageCircle,
  Gauge,
  Code,
  Terminal,
  Rocket,
  Users,
  Shield,
  Star,
  ArrowRight,
  Check,
  Cpu,
  GitBranch,
  Sparkles
} from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function Home() {
  const features = [
    {
      icon: Zap,
      title: 'Blazing Fast',
      description: 'Sub-1ms input latency with GPU-accelerated rendering. Feel the speed.',
      color: 'yellow' as const,
    },
    {
      icon: Brain,
      title: 'AI Superpowers',
      description: 'Multi-LLM support (Gemini, Claude, GPT-4). AI that actually understands your code.',
      color: 'cyan' as const,
    },
    {
      icon: MessageCircle,
      title: 'Discord Built-in',
      description: 'Voice, chat, and screen sharing without leaving your editor. Code together.',
      color: 'pink' as const,
    },
    {
      icon: Cpu,
      title: 'GPU Execution',
      description: 'Run Python, Julia, and shaders directly on GPU. ML training in your editor.',
      color: 'purple' as const,
    },
    {
      icon: Code,
      title: 'LSP Support',
      description: 'All your favorite languages with intelligent completions and diagnostics.',
      color: 'green' as const,
    },
    {
      icon: GitBranch,
      title: 'Git Integration',
      description: 'Visual diff, merge tools, and seamless version control built-in.',
      color: 'yellow' as const,
    },
  ]

  const stats = [
    { value: '<1ms', label: 'Input Latency' },
    { value: '10x', label: 'Faster Than VSCode' },
    { value: '100%', label: 'Open Source' },
    { value: '0', label: 'Context Switching' },
  ]

  const testimonials = [
    {
      quote: "Nexus increased my coding speed by 40%. The AI actually understands my codebase.",
      author: "Sarah K.",
      role: "ML Engineer",
    },
    {
      quote: "Finally, I can pair program without leaving my editor. Discord integration is genius.",
      author: "Mike T.",
      role: "Senior Developer",
    },
    {
      quote: "GPU execution changed my workflow. Training models right in the editor is incredible.",
      author: "Alex R.",
      role: "Data Scientist",
    },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      features: [
        'Full editor features',
        'Local AI (BYOK)',
        'Basic Discord integration',
        'Community plugins',
        'Open source',
      ],
      cta: 'Get Started',
      href: '/signup',
      popular: false,
    },
    {
      name: 'Pro',
      price: '$10',
      period: 'per month',
      features: [
        'Everything in Free',
        'Hosted AI credits',
        'Advanced Discord features',
        'Premium plugins',
        'Cloud sync',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      href: '/signup?plan=pro',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      features: [
        'Everything in Pro',
        'Self-hosted option',
        'SSO/SAML',
        'Advanced security',
        'SLA guarantees',
        'Dedicated support',
      ],
      cta: 'Contact Sales',
      href: '/contact?type=enterprise',
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white border-b-8 border-black">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 1px, transparent 0, transparent 50%)',
            backgroundSize: '20px 20px',
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-neo-yellow border-4 border-black px-6 py-2 mb-8 neo-shadow-sm">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">Now in Beta • Join 1000+ Developers</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
              The AI-Native
              <br />
              Code Editor That
              <br />
              <span className="inline-block bg-neo-yellow border-6 border-black px-4 py-2 -rotate-2 neo-shadow-lg">
                Doesn't Suck
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-12 text-gray-700 font-medium">
              Stop wasting 3+ hours daily context switching between your editor, AI chat, and Discord.
              <span className="font-bold text-black"> Everything in one place.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link href="/signup">
                <Button size="lg" variant="primary" className="text-xl min-w-[200px]">
                  <Rocket className="w-6 h-6 mr-2" />
                  Get Started Free
                </Button>
              </Link>
              <Link href="/demo">
                <Button size="lg" variant="outline" className="text-xl min-w-[200px]">
                  <Terminal className="w-6 h-6 mr-2" />
                  Watch Demo
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap gap-6 justify-center items-center text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-5 h-5 fill-current text-yellow-500 mr-1" />
                <span className="font-bold">4.9/5</span> on Product Hunt
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-1" />
                <span className="font-bold">1,000+</span> beta users
              </div>
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-1" />
                <span className="font-bold">100%</span> open source
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-neo-black text-white py-16 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-6xl font-display font-bold text-neo-yellow mb-2">
                  {stat.value}
                </div>
                <div className="text-lg text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Problem */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                The Problem
              </h2>
              <div className="space-y-4 text-lg text-gray-700">
                <p className="flex items-start">
                  <span className="text-3xl mr-3">💻</span>
                  Code in VSCode/Vim
                </p>
                <p className="flex items-start">
                  <span className="text-3xl mr-3">🤖</span>
                  AI chat in browser tabs
                </p>
                <p className="flex items-start">
                  <span className="text-3xl mr-3">💬</span>
                  Team communication in Discord/Slack
                </p>
                <p className="flex items-start">
                  <span className="text-3xl mr-3">🔍</span>
                  Documentation in Chrome
                </p>
                <p className="flex items-start">
                  <span className="text-3xl mr-3">🏃</span>
                  Terminal in separate window
                </p>
              </div>
              <div className="mt-8 p-6 bg-neo-pink border-4 border-black neo-shadow">
                <p className="text-2xl font-bold">
                  = 3+ hours wasted daily on context switching
                </p>
              </div>
            </div>

            {/* Solution */}
            <div>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
                The Solution
              </h2>
              <div className="p-8 bg-neo-yellow border-4 border-black neo-shadow-lg">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-3xl font-bold mb-4">Everything. One Place.</h3>
                <ul className="space-y-3 text-lg">
                  <li className="flex items-start">
                    <Check className="w-6 h-6 mr-2 flex-shrink-0" />
                    <span><strong>Code</strong> with sub-1ms latency</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-6 h-6 mr-2 flex-shrink-0" />
                    <span><strong>AI</strong> that understands your codebase</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-6 h-6 mr-2 flex-shrink-0" />
                    <span><strong>Discord</strong> voice & chat built-in</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-6 h-6 mr-2 flex-shrink-0" />
                    <span><strong>Terminal</strong> GPU-accelerated</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-6 h-6 mr-2 flex-shrink-0" />
                    <span><strong>Git</strong> visual tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Superpowers Built-In
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Not bolted on as afterthoughts. Core features designed to work together seamlessly.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} color={feature.color} hover>
                <feature.icon className="w-12 h-12 mb-4" />
                <h3 className="text-2xl font-bold mb-3 font-display">{feature.title}</h3>
                <p className="text-lg">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/features">
              <Button variant="outline" size="lg">
                View All Features
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Loved by Developers
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} color="white" hover>
                <div className="mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current text-yellow-500" />
                  ))}
                </div>
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Simple Pricing
            </h2>
            <p className="text-xl text-gray-700">
              Start free. Upgrade when you need more.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-neo-pink border-4 border-black px-6 py-2 neo-shadow-sm z-10">
                    <span className="font-bold">Most Popular</span>
                  </div>
                )}
                <Card
                  color={plan.popular ? 'yellow' : 'white'}
                  className={`h-full flex flex-col ${plan.popular ? 'ring-4 ring-black' : ''}`}
                >
                  <h3 className="text-2xl font-bold mb-2 font-display">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-gray-600">/{plan.period}</span>}
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={plan.href}>
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neo-cyan border-b-8 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Ready to Code Faster?
          </h2>
          <p className="text-xl mb-10 text-gray-800">
            Join thousands of developers who've already made the switch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="text-xl min-w-[250px]">
                <Rocket className="w-6 h-6 mr-2" />
                Start Free Today
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-xl min-w-[250px]">
                <Terminal className="w-6 h-6 mr-2" />
                Book a Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-700">
            No credit card required • 100% open source • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
