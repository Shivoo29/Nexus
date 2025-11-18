'use client'

import {
  Zap,
  Brain,
  MessageCircle,
  Cpu,
  Code,
  GitBranch,
  Terminal,
  Palette,
  Search,
  Boxes,
  Rocket,
  Shield,
  Gauge,
  Sparkles,
  Play,
} from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function FeaturesPage() {
  const mainFeatures = [
    {
      icon: Zap,
      title: 'Blazing Fast Performance',
      description: 'Experience sub-1ms input latency with GPU-accelerated rendering',
      details: [
        'Metal/Vulkan/DirectX rendering',
        'Zero-lag scrolling in 100k+ line files',
        'Instant search across millions of lines',
        'Native compilation with Rust',
      ],
      color: 'yellow' as const,
    },
    {
      icon: Brain,
      title: 'AI Superpowers',
      description: 'Multi-LLM support that actually understands your codebase',
      details: [
        'Context-aware code completions',
        'Inline AI chat (Cmd+K)',
        'Smart refactoring suggestions',
        'Automatic test generation',
      ],
      color: 'cyan' as const,
    },
    {
      icon: MessageCircle,
      title: 'Discord Integration',
      description: 'Native voice, chat, and screen sharing without leaving your editor',
      details: [
        'Voice channels in sidebar',
        'Real-time collaborative editing',
        'Screen sharing with cursor tracking',
        'Code snippet sharing to Discord',
      ],
      color: 'pink' as const,
    },
    {
      icon: Cpu,
      title: 'GPU Execution Engine',
      description: 'Run Python, Julia, and shaders directly on GPU',
      details: [
        'ML model training in editor',
        'Live shader coding with preview',
        'Parallel test execution',
        'Local AI inference on GPU',
      ],
      color: 'purple' as const,
    },
  ]

  const allFeatures = [
    { icon: Code, title: 'LSP Support', description: 'All major languages with intelligent completions' },
    { icon: GitBranch, title: 'Git Integration', description: 'Visual diff, merge tools, and version control' },
    { icon: Terminal, title: 'Integrated Terminal', description: 'GPU-accelerated terminal built-in' },
    { icon: Palette, title: 'Customizable Themes', description: '100+ themes and custom theme creator' },
    { icon: Search, title: 'Fuzzy Search', description: 'Lightning-fast file and symbol search' },
    { icon: Boxes, title: 'Plugin System', description: 'Extend with Rust, Lua, or WASM plugins' },
    { icon: Rocket, title: 'Live Preview', description: 'Real-time preview for Markdown, HTML, LaTeX' },
    { icon: Shield, title: 'Security First', description: 'Local-first, end-to-end encrypted, SOC 2' },
  ]

  const comparisons = [
    {
      metric: 'Startup Time',
      nexus: '0.15s',
      vscode: '1.2s',
      zed: '0.3s',
      winner: 'nexus',
    },
    {
      metric: 'Open 10MB File',
      nexus: '50ms',
      vscode: '800ms',
      zed: '200ms',
      winner: 'nexus',
    },
    {
      metric: 'Search 1M Lines',
      nexus: '100ms',
      vscode: '2s',
      zed: '500ms',
      winner: 'nexus',
    },
    {
      metric: 'AI Completion',
      nexus: '80ms',
      vscode: '300ms',
      zed: 'N/A',
      winner: 'nexus',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 border-b-8 border-black bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-neo-cyan border-4 border-black px-6 py-2 mb-8 neo-shadow-sm">
            <Sparkles className="w-5 h-5" />
            <span className="font-bold">Everything You Need, Built-In</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Features That Make
            <br />
            <span className="bg-neo-yellow border-6 border-black px-4 py-2 inline-block -rotate-1 neo-shadow-lg">
              Coding a Joy
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12">
            Stop juggling multiple tools. Everything you need for modern development, in one blazing-fast editor.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="text-xl">
                <Rocket className="w-6 h-6 mr-2" />
                Try It Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-xl">
                <Play className="w-6 h-6 mr-2" />
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Core Superpowers
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Not afterthoughts or bolt-ons. These features are built into the core of Nexus.
            </p>
          </div>

          <div className="space-y-12">
            {mainFeatures.map((feature, index) => (
              <div
                key={index}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <Card color={feature.color} hover className="h-full">
                    <feature.icon className="w-16 h-16 mb-6" />
                    <h3 className="text-3xl font-display font-bold mb-4">{feature.title}</h3>
                    <p className="text-xl mb-6">{feature.description}</p>
                    <ul className="space-y-3">
                      {feature.details.map((detail, i) => (
                        <li key={i} className="flex items-start">
                          <div className="w-2 h-2 bg-black mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-lg">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </div>

                <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                  <div className="p-8 border-4 border-black bg-gray-900 neo-shadow-lg">
                    <div className="font-mono text-sm text-green-400">
                      <div className="mb-2">
                        <span className="text-purple-400">{'// '}</span>
                        <span>{feature.title} Demo</span>
                      </div>
                      <div className="text-gray-500">{'// Live code example would go here'}</div>
                      <div className="mt-4">
                        <span className="text-blue-400">function</span>{' '}
                        <span className="text-yellow-400">example</span>
                        <span>() {'{'}</span>
                      </div>
                      <div className="pl-4 text-cyan-400">
                        return <span className="text-green-400">"amazing"</span>
                      </div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              And So Much More
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allFeatures.map((feature, index) => (
              <Card key={index} color="white" hover>
                <feature.icon className="w-10 h-10 mb-4" />
                <h3 className="text-xl font-bold mb-2 font-display">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Comparison */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
              Performance That Speaks
            </h2>
            <p className="text-xl text-gray-700">
              Benchmarked on M2 MacBook Pro. Numbers don't lie.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="border-4 border-black">
              <div className="grid grid-cols-4 bg-neo-yellow border-b-4 border-black">
                <div className="p-4 font-display font-bold text-lg border-r-4 border-black">
                  Metric
                </div>
                <div className="p-4 font-display font-bold text-center border-r-4 border-black">
                  Nexus
                </div>
                <div className="p-4 font-display font-bold text-center border-r-4 border-black">
                  VSCode
                </div>
                <div className="p-4 font-display font-bold text-center">Zed</div>
              </div>

              {comparisons.map((row, index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 ${
                    index < comparisons.length - 1 ? 'border-b-4 border-black' : ''
                  } ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <div className="p-4 font-bold border-r-4 border-black">{row.metric}</div>
                  <div
                    className={`p-4 text-center font-mono font-bold border-r-4 border-black ${
                      row.winner === 'nexus' ? 'bg-neo-green' : ''
                    }`}
                  >
                    {row.nexus}
                    {row.winner === 'nexus' && ' ⚡'}
                  </div>
                  <div className="p-4 text-center font-mono border-r-4 border-black">
                    {row.vscode}
                  </div>
                  <div className="p-4 text-center font-mono">{row.zed}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Card color="cyan" className="max-w-2xl mx-auto">
              <Gauge className="w-12 h-12 mx-auto mb-4" />
              <p className="text-xl font-bold mb-2">
                10x faster than VSCode, 2x faster than Zed
              </p>
              <p className="text-gray-700">
                And we're just getting started. Performance improvements every week.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neo-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Experience the Difference
          </h2>
          <p className="text-xl mb-10">
            Try all features free for 14 days. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="text-xl min-w-[200px]">
                <Rocket className="w-6 h-6 mr-2" />
                Start Free Trial
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="text-xl min-w-[200px]">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
