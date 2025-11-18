import Link from 'next/link'
import { Check, X, Zap, Crown, Building2, ArrowRight, HelpCircle } from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for individual developers and open source projects',
      features: [
        { text: 'Full editor features', included: true },
        { text: 'Local AI (bring your own API key)', included: true },
        { text: 'Basic Discord integration', included: true },
        { text: 'Community plugins', included: true },
        { text: 'Git integration', included: true },
        { text: 'LSP support for all languages', included: true },
        { text: 'GPU rendering', included: true },
        { text: 'Hosted AI credits', included: false },
        { text: 'Cloud sync', included: false },
        { text: 'Priority support', included: false },
      ],
      cta: 'Get Started Free',
      href: '/signup',
      color: 'white' as const,
      popular: false,
    },
    {
      name: 'Pro',
      price: '$10',
      period: 'per month',
      description: 'For professional developers who want maximum productivity',
      features: [
        { text: 'Everything in Free', included: true, highlight: true },
        { text: 'Unlimited hosted AI credits', included: true },
        { text: 'Advanced Discord features', included: true },
        { text: 'Premium plugins & themes', included: true },
        { text: 'Cloud sync across devices', included: true },
        { text: 'Advanced git tools', included: true },
        { text: 'GPU code execution', included: true },
        { text: 'Priority support (24h response)', included: true },
        { text: 'Early access to new features', included: true },
        { text: 'Custom AI model training', included: false },
      ],
      cta: 'Start 14-Day Free Trial',
      href: '/signup?plan=pro',
      color: 'yellow' as const,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For teams and organizations with advanced needs',
      features: [
        { text: 'Everything in Pro', included: true, highlight: true },
        { text: 'Self-hosted deployment option', included: true },
        { text: 'SSO/SAML authentication', included: true },
        { text: 'Advanced security & compliance', included: true },
        { text: 'Custom AI model training', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA with 99.9% uptime', included: true },
        { text: 'Priority support (1h response)', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Unlimited team members', included: true },
      ],
      cta: 'Contact Sales',
      href: '/contact?type=enterprise',
      color: 'cyan' as const,
      popular: false,
    },
  ]

  const faqs = [
    {
      question: 'Can I change plans later?',
      answer: 'Yes! You can upgrade, downgrade, or cancel your plan at any time. Changes take effect immediately, and we prorate any charges.',
    },
    {
      question: 'What happens when I hit the AI credit limit on Free?',
      answer: 'You can either bring your own API key for unlimited usage, or upgrade to Pro for hosted credits.',
    },
    {
      question: 'Do you offer student discounts?',
      answer: 'Yes! Students get 50% off Pro plans. Just verify your student status with GitHub Student Developer Pack.',
    },
    {
      question: 'Is there a team plan?',
      answer: 'Pro plans can be purchased for teams at $10/user/month. Enterprise plans include team management features.',
    },
    {
      question: 'Can I use Nexus offline?',
      answer: 'Absolutely! Nexus works fully offline. Cloud sync and hosted AI features require internet, but you can use local AI models.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
    },
  ]

  const comparison = [
    { feature: 'Editor Performance', free: 'Sub-1ms latency', pro: 'Sub-1ms latency', enterprise: 'Sub-1ms latency' },
    { feature: 'AI Requests/Month', free: '100', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Cloud Storage', free: '-', pro: '10GB', enterprise: 'Unlimited' },
    { feature: 'Team Members', free: '1', pro: '1', enterprise: 'Unlimited' },
    { feature: 'Support', free: 'Community', pro: '24h response', enterprise: '1h response' },
    { feature: 'Custom Plugins', free: 'Public', pro: 'Public + Private', enterprise: 'Full control' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-neo-green border-4 border-black px-6 py-2 mb-8 neo-shadow-sm">
            <Zap className="w-5 h-5" />
            <span className="font-bold">Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6">
            Choose Your Plan
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12">
            Start free. Upgrade when you need more power. Cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-4 mb-12">
            <span className="font-bold">Monthly</span>
            <button className="w-16 h-8 bg-neo-yellow border-4 border-black relative">
              <div className="absolute left-1 top-1 w-6 h-6 bg-black"></div>
            </button>
            <span className="text-gray-500">Yearly (Save 20%)</span>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className="relative">
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-neo-pink border-4 border-black px-6 py-2 neo-shadow-sm z-10">
                    <div className="flex items-center space-x-2">
                      <Crown className="w-5 h-5" />
                      <span className="font-bold">Most Popular</span>
                    </div>
                  </div>
                )}

                <Card
                  color={plan.color}
                  className={`h-full flex flex-col ${
                    plan.popular ? 'ring-4 ring-black scale-105' : ''
                  }`}
                >
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      {index === 0 && <Zap className="w-6 h-6" />}
                      {index === 1 && <Crown className="w-6 h-6" />}
                      {index === 2 && <Building2 className="w-6 h-6" />}
                      <h3 className="text-3xl font-display font-bold">{plan.name}</h3>
                    </div>
                    <p className="text-gray-700 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b-4 border-black">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && (
                        <span className="text-gray-600">/{plan.period}</span>
                      )}
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <div className={`w-6 h-6 border-2 border-black flex items-center justify-center mr-3 flex-shrink-0 ${
                          feature.included ? 'bg-neo-green' : 'bg-gray-200'
                        }`}>
                          {feature.included ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <X className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <span className={feature.highlight ? 'font-bold' : ''}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link href={plan.href}>
                    <Button
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                      className="w-full"
                    >
                      {plan.cta}
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </Card>
              </div>
            ))}
          </div>

          {/* Enterprise Contact */}
          <div className="mt-12 text-center">
            <Card color="purple" className="max-w-2xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="text-2xl font-bold mb-2">Need a custom solution?</h3>
                  <p className="text-white">
                    Talk to our sales team about volume discounts and custom deployments.
                  </p>
                </div>
                <Link href="/contact?type=enterprise">
                  <Button variant="outline" size="lg">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 bg-white border-b-8 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">
            Detailed Comparison
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-4 border-black">
              <thead>
                <tr className="bg-neo-yellow border-b-4 border-black">
                  <th className="p-4 text-left font-display text-xl border-r-4 border-black">
                    Feature
                  </th>
                  <th className="p-4 font-display text-xl border-r-4 border-black">Free</th>
                  <th className="p-4 font-display text-xl border-r-4 border-black">Pro</th>
                  <th className="p-4 font-display text-xl">Enterprise</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b-4 border-black ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-4 font-bold border-r-4 border-black">{row.feature}</td>
                    <td className="p-4 text-center border-r-4 border-black">{row.free}</td>
                    <td className="p-4 text-center border-r-4 border-black font-bold">
                      {row.pro}
                    </td>
                    <td className="p-4 text-center font-bold">{row.enterprise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50 border-b-8 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-12 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} color="white" hover>
                <div className="flex items-start">
                  <HelpCircle className="w-6 h-6 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-gray-700 mb-4">Still have questions?</p>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-neo-yellow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-6">
            Ready to Start Coding Faster?
          </h2>
          <p className="text-xl mb-10">
            Join thousands of developers building better software with Nexus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" variant="primary" className="text-xl min-w-[200px]">
                <Zap className="w-6 h-6 mr-2" />
                Get Started Free
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="text-xl min-w-[200px]">
                Watch Demo
              </Button>
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-700">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>
    </div>
  )
}
