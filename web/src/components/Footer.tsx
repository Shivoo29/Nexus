import Link from 'next/link'
import { Github, Twitter, MessageCircle, Mail, Zap } from 'lucide-react'

export default function Footer() {
  const footerLinks = {
    Product: [
      { label: 'Features', href: '/features' },
      { label: 'Pricing', href: '/pricing' },
      { label: 'Changelog', href: '/changelog' },
      { label: 'Roadmap', href: '/roadmap' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Guides', href: '/guides' },
      { label: 'API Reference', href: '/api' },
      { label: 'Community', href: '/community' },
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
    Legal: [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
      { label: 'Security', href: '/security' },
      { label: 'License', href: '/license' },
    ],
  }

  const socialLinks = [
    { icon: Github, href: 'https://github.com/nexus-ide', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/nexus_ide', label: 'Twitter' },
    { icon: MessageCircle, href: 'https://discord.gg/nexus-ide', label: 'Discord' },
    { icon: Mail, href: 'mailto:hello@nexus-ide.dev', label: 'Email' },
  ]

  return (
    <footer className="bg-neo-black text-white border-t-8 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-neo-yellow border-4 border-white flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-display font-bold">Nexus</span>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              The AI-native code editor that doesn't suck. Stop context switching. Start coding in flow.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border-3 border-white bg-neo-black hover:bg-white hover:text-black transition-all flex items-center justify-center group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-bold text-lg mb-4 font-display">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-neo-yellow transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t-4 border-gray-800 pt-8 mb-8">
          <div className="max-w-md">
            <h3 className="font-bold text-xl mb-2 font-display">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest updates, tips, and exclusive content.
            </p>
            <form className="flex gap-3">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 border-4 border-white bg-black text-white font-mono focus:outline-none focus:ring-0 placeholder:text-gray-600"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-neo-yellow text-black font-bold border-4 border-white hover:bg-neo-cyan transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t-4 border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Nexus IDE. Built with ❤️ by developers, for developers.
          </p>
          <div className="flex items-center space-x-6">
            <span className="text-gray-400 text-sm">MIT License</span>
            <span className="text-gray-400 text-sm">Made with Rust 🦀</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
