import Link from 'next/link'
import {
  BookOpen,
  Rocket,
  Code,
  Settings,
  Puzzle,
  Terminal,
  Search,
  MessageCircle,
  ArrowRight,
} from 'lucide-react'
import Card from '@/components/Card'
import Button from '@/components/Button'

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: Rocket,
      color: 'yellow' as const,
      links: [
        { title: 'Quick Start', href: '/docs/quickstart', description: 'Get up and running in 5 minutes' },
        { title: 'Installation', href: '/docs/installation', description: 'Install on macOS, Linux, or Windows' },
        { title: 'First Project', href: '/docs/first-project', description: 'Create your first project' },
        { title: 'Basic Features', href: '/docs/basics', description: 'Learn the essentials' },
      ],
    },
    {
      title: 'Core Features',
      icon: Code,
      color: 'cyan' as const,
      links: [
        { title: 'Editor Basics', href: '/docs/editor', description: 'Text editing, navigation, and commands' },
        { title: 'AI Assistant', href: '/docs/ai', description: 'Use AI to code faster' },
        { title: 'Discord Integration', href: '/docs/discord', description: 'Collaborate with your team' },
        { title: 'Git & Version Control', href: '/docs/git', description: 'Manage your code versions' },
      ],
    },
    {
      title: 'Advanced',
      icon: Settings,
      color: 'pink' as const,
      links: [
        { title: 'GPU Execution', href: '/docs/gpu', description: 'Run code on GPU' },
        { title: 'Custom Themes', href: '/docs/themes', description: 'Customize your editor' },
        { title: 'Keybindings', href: '/docs/keybindings', description: 'Learn shortcuts & customize' },
        { title: 'Performance Tuning', href: '/docs/performance', description: 'Optimize for your setup' },
      ],
    },
    {
      title: 'Plugins & Extensions',
      icon: Puzzle,
      color: 'purple' as const,
      links: [
        { title: 'Plugin Marketplace', href: '/docs/plugins', description: 'Browse and install plugins' },
        { title: 'Creating Plugins', href: '/docs/plugin-dev', description: 'Build your own plugins' },
        { title: 'Plugin API', href: '/docs/plugin-api', description: 'API reference for developers' },
        { title: 'Publishing Plugins', href: '/docs/plugin-publish', description: 'Share with the community' },
      ],
    },
    {
      title: 'API & CLI',
      icon: Terminal,
      color: 'green' as const,
      links: [
        { title: 'Command Line', href: '/docs/cli', description: 'Use Nexus from the terminal' },
        { title: 'Configuration', href: '/docs/config', description: 'Config files and settings' },
        { title: 'Automation', href: '/docs/automation', description: 'Automate your workflow' },
        { title: 'API Reference', href: '/docs/api', description: 'Complete API documentation' },
      ],
    },
    {
      title: 'Help & Support',
      icon: MessageCircle,
      color: 'yellow' as const,
      links: [
        { title: 'FAQ', href: '/docs/faq', description: 'Frequently asked questions' },
        { title: 'Troubleshooting', href: '/docs/troubleshooting', description: 'Common issues and solutions' },
        { title: 'Community', href: '/community', description: 'Join the community' },
        { title: 'Contact Support', href: '/contact', description: 'Get help from our team' },
      ],
    },
  ]

  const quickLinks = [
    { title: 'Keyboard Shortcuts', href: '/docs/shortcuts' },
    { title: 'Configuration Reference', href: '/docs/config-ref' },
    { title: 'Migration from VSCode', href: '/docs/migrate-vscode' },
    { title: 'Migration from Vim', href: '/docs/migrate-vim' },
    { title: 'Performance Benchmarks', href: '/docs/benchmarks' },
    { title: 'Security & Privacy', href: '/docs/security' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-8">
            <div className="w-16 h-16 bg-neo-cyan border-4 border-black flex items-center justify-center mr-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold">
              Documentation
            </h1>
          </div>

          <p className="text-xl md:text-2xl text-gray-700 text-center max-w-3xl mx-auto mb-12">
            Everything you need to know to get the most out of Nexus
          </p>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="w-full pl-16 pr-6 py-4 border-4 border-black font-mono text-lg focus:outline-none focus:ring-0 neo-shadow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-12 bg-neo-yellow border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">
                New to Nexus?
              </h2>
              <p className="text-lg">
                Get started in under 5 minutes with our quick start guide
              </p>
            </div>
            <Link href="/docs/quickstart">
              <Button variant="primary" size="lg" className="mt-4 md:mt-0">
                <Rocket className="w-5 h-5 mr-2" />
                Quick Start Guide
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card key={index} color={section.color} hover>
                <div className="flex items-center mb-4">
                  <section.icon className="w-8 h-8 mr-3" />
                  <h3 className="text-2xl font-display font-bold">{section.title}</h3>
                </div>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="block group hover:translate-x-1 transition-transform"
                      >
                        <h4 className="font-bold group-hover:underline">{link.title}</h4>
                        <p className="text-sm text-gray-700">{link.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-display font-bold mb-8 text-center">
            Popular Pages
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link, index) => (
              <Link key={index} href={link.href}>
                <div className="p-4 border-4 border-black bg-white neo-shadow hover:neo-shadow-lg hover:-translate-x-1 hover:-translate-y-1 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{link.title}</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neo-pink">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-xl mb-10">
            Our community and support team are here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/community">
              <Button size="lg" variant="outline">
                <MessageCircle className="w-6 h-6 mr-2" />
                Join Discord
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="primary">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
