'use client'

import { useState } from 'react'
import { Mail, MessageCircle, Send, MapPin, Phone, Github, Twitter } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would send to your backend
    console.log('Form submitted:', formData)
    setSubmitted(true)
  }

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get a response within 24 hours',
      value: 'hello@nexus-ide.dev',
      href: 'mailto:hello@nexus-ide.dev',
      color: 'yellow' as const,
    },
    {
      icon: MessageCircle,
      title: 'Join Discord',
      description: 'Chat with the community',
      value: 'discord.gg/nexus-ide',
      href: 'https://discord.gg/nexus-ide',
      color: 'purple' as const,
    },
    {
      icon: Github,
      title: 'GitHub Issues',
      description: 'Report bugs or request features',
      value: 'github.com/nexus-ide',
      href: 'https://github.com/nexus-ide',
      color: 'cyan' as const,
    },
  ]

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market St, Suite 400',
      country: 'United States',
    },
    {
      city: 'London',
      address: '456 Tech Lane',
      country: 'United Kingdom',
    },
    {
      city: 'Remote',
      address: 'Worldwide team',
      country: 'Global',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Get In Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
            We're here to help. Choose your preferred way to reach us.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Card color={method.color} hover className="h-full">
                  <method.icon className="w-12 h-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2 font-display">{method.title}</h3>
                  <p className="text-gray-700 mb-3">{method.description}</p>
                  <p className="font-mono font-bold">{method.value}</p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-4xl font-display font-bold mb-6">Send Us a Message</h2>
              <p className="text-lg text-gray-700 mb-8">
                Fill out the form and we'll get back to you within 24 hours.
              </p>

              {submitted ? (
                <Card color="green">
                  <div className="text-center py-8">
                    <Send className="w-16 h-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
                    <p className="text-lg">
                      We've received your message and will respond soon.
                    </p>
                  </div>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block font-bold mb-2">
                      Your Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0 transition-all"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block font-bold mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0 transition-all"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block font-bold mb-2">
                      What can we help with?
                    </label>
                    <select
                      id="type"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales & Enterprise</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block font-bold mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full px-4 py-3 border-4 border-black font-mono focus:outline-none focus:ring-0 transition-all resize-none"
                      placeholder="Tell us more..."
                    />
                  </div>

                  <Button type="submit" variant="primary" size="lg" className="w-full">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              )}
            </div>

            {/* Info */}
            <div>
              <Card color="yellow" className="mb-8">
                <h3 className="text-2xl font-bold mb-4 font-display">Enterprise Sales</h3>
                <p className="text-gray-700 mb-4">
                  Looking for a custom solution for your team?
                </p>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 mr-3" />
                    <a href="mailto:sales@nexus-ide.dev" className="font-mono font-bold hover:underline">
                      sales@nexus-ide.dev
                    </a>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 mr-3" />
                    <span className="font-mono font-bold">+1 (555) 123-4567</span>
                  </div>
                </div>
              </Card>

              <Card color="cyan" className="mb-8">
                <h3 className="text-2xl font-bold mb-4 font-display">Support</h3>
                <p className="text-gray-700 mb-4">
                  Need technical help? Check out our resources:
                </p>
                <ul className="space-y-2">
                  <li>
                    <a href="/docs" className="font-bold hover:underline">
                      • Documentation
                    </a>
                  </li>
                  <li>
                    <a href="/docs/faq" className="font-bold hover:underline">
                      • FAQ
                    </a>
                  </li>
                  <li>
                    <a href="/community" className="font-bold hover:underline">
                      • Community Forum
                    </a>
                  </li>
                  <li>
                    <a href="https://github.com/nexus-ide/issues" className="font-bold hover:underline">
                      • GitHub Issues
                    </a>
                  </li>
                </ul>
              </Card>

              <Card color="pink">
                <h3 className="text-2xl font-bold mb-4 font-display">Our Offices</h3>
                <div className="space-y-4">
                  {offices.map((office, index) => (
                    <div key={index} className="flex items-start">
                      <MapPin className="w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-bold">{office.city}</p>
                        <p className="text-sm text-gray-700">{office.address}</p>
                        <p className="text-sm text-gray-600">{office.country}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="py-20 bg-neo-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">Follow Us</h2>
          <p className="text-xl text-gray-400 mb-8">
            Stay updated with the latest news, tips, and releases
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="https://twitter.com/nexus_ide"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 border-4 border-white bg-black hover:bg-white hover:text-black transition-all flex items-center justify-center neo-shadow-sm"
            >
              <Twitter className="w-8 h-8" />
            </a>
            <a
              href="https://github.com/nexus-ide"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 border-4 border-white bg-black hover:bg-white hover:text-black transition-all flex items-center justify-center neo-shadow-sm"
            >
              <Github className="w-8 h-8" />
            </a>
            <a
              href="https://discord.gg/nexus-ide"
              target="_blank"
              rel="noopener noreferrer"
              className="w-16 h-16 border-4 border-white bg-black hover:bg-white hover:text-black transition-all flex items-center justify-center neo-shadow-sm"
            >
              <MessageCircle className="w-8 h-8" />
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
