'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Code,
  Palette,
  Download,
  Sparkles,
  Check,
  ArrowRight,
  ArrowLeft,
  Zap,
  MessageCircle,
  Terminal,
} from 'lucide-react'
import Button from '@/components/Button'
import Card from '@/components/Card'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [selections, setSelections] = useState({
    role: '',
    languages: [] as string[],
    theme: '',
    aiProvider: '',
    discordIntegration: false,
  })

  const totalSteps = 5

  const roles = [
    { id: 'frontend', label: 'Frontend Developer', icon: '🎨' },
    { id: 'backend', label: 'Backend Developer', icon: '⚙️' },
    { id: 'fullstack', label: 'Full-Stack Developer', icon: '🔥' },
    { id: 'ml', label: 'ML/AI Engineer', icon: '🤖' },
    { id: 'data', label: 'Data Scientist', icon: '📊' },
    { id: 'devops', label: 'DevOps Engineer', icon: '🚀' },
  ]

  const languages = [
    { id: 'javascript', label: 'JavaScript', color: 'yellow' as const },
    { id: 'typescript', label: 'TypeScript', color: 'cyan' as const },
    { id: 'python', label: 'Python', color: 'green' as const },
    { id: 'rust', label: 'Rust', color: 'orange' as const },
    { id: 'go', label: 'Go', color: 'cyan' as const },
    { id: 'java', label: 'Java', color: 'pink' as const },
    { id: 'csharp', label: 'C#', color: 'purple' as const },
    { id: 'cpp', label: 'C++', color: 'yellow' as const },
  ]

  const themes = [
    { id: 'light', label: 'Light Mode', preview: 'bg-white text-black' },
    { id: 'dark', label: 'Dark Mode', preview: 'bg-black text-white' },
    { id: 'highContrast', label: 'High Contrast', preview: 'bg-yellow-400 text-black' },
    { id: 'custom', label: 'Custom Theme', preview: 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' },
  ]

  const aiProviders = [
    { id: 'gemini', label: 'Gemini', description: 'Google\'s latest AI model (Recommended)' },
    { id: 'claude', label: 'Claude', description: 'Anthropic\'s powerful assistant' },
    { id: 'gpt4', label: 'GPT-4', description: 'OpenAI\'s advanced model' },
    { id: 'local', label: 'Local LLM', description: 'Run models locally (Ollama)' },
  ]

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Complete onboarding
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleLanguage = (langId: string) => {
    setSelections((prev) => ({
      ...prev,
      languages: prev.languages.includes(langId)
        ? prev.languages.filter((l) => l !== langId)
        : [...prev.languages, langId],
    }))
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-display font-bold">Setup Your Workspace</h2>
            <span className="text-sm font-mono font-bold">
              Step {step} of {totalSteps}
            </span>
          </div>
          <div className="h-3 bg-gray-200 border-4 border-black">
            <div
              className="h-full bg-neo-yellow transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Role Selection */}
        {step === 1 && (
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              What's your role?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We'll customize your experience based on your development focus.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setSelections({ ...selections, role: role.id })}
                  className={`p-6 border-4 border-black text-left transition-all ${
                    selections.role === role.id
                      ? 'bg-neo-yellow neo-shadow-lg -translate-x-2 -translate-y-2'
                      : 'bg-white neo-shadow hover:neo-shadow-lg hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <div className="text-4xl mb-2">{role.icon}</div>
                  <h3 className="font-bold text-lg">{role.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Language Selection */}
        {step === 2 && (
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Which languages do you use?
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Select all that apply. We'll set up language servers and tooling.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => toggleLanguage(lang.id)}
                  className={`p-6 border-4 border-black text-left transition-all ${
                    selections.languages.includes(lang.id)
                      ? `bg-neo-${lang.color} neo-shadow-lg -translate-x-2 -translate-y-2`
                      : 'bg-white neo-shadow hover:neo-shadow-lg hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Code className="w-8 h-8" />
                    {selections.languages.includes(lang.id) && (
                      <Check className="w-6 h-6" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg">{lang.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Theme Selection */}
        {step === 3 && (
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Choose your theme
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Pick your coding aesthetic. You can change this anytime.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelections({ ...selections, theme: theme.id })}
                  className={`relative overflow-hidden border-4 border-black transition-all ${
                    selections.theme === theme.id
                      ? 'neo-shadow-lg -translate-x-2 -translate-y-2 ring-4 ring-black'
                      : 'neo-shadow hover:neo-shadow-lg hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <div className={`p-8 ${theme.preview} text-left`}>
                    <div className="flex items-center justify-between mb-4">
                      <Palette className="w-8 h-8" />
                      {selections.theme === theme.id && (
                        <div className="w-8 h-8 bg-neo-green border-2 border-black flex items-center justify-center">
                          <Check className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-2xl mb-2">{theme.label}</h3>
                    <div className="font-mono text-sm opacity-75">
                      <div>{'// Your code here'}</div>
                      <div>{'function hello() {'}</div>
                      <div>{'  return "world"'}</div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: AI Provider */}
        {step === 4 && (
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Configure AI Assistant
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose your AI provider. You can switch or use multiple later.
            </p>

            <div className="space-y-4">
              {aiProviders.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => setSelections({ ...selections, aiProvider: provider.id })}
                  className={`w-full p-6 border-4 border-black text-left transition-all ${
                    selections.aiProvider === provider.id
                      ? 'bg-neo-yellow neo-shadow-lg -translate-x-2 -translate-y-2'
                      : 'bg-white neo-shadow hover:neo-shadow-lg hover:-translate-x-1 hover:-translate-y-1'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-2xl mb-2">{provider.label}</h3>
                      <p className="text-gray-700">{provider.description}</p>
                    </div>
                    {selections.aiProvider === provider.id && (
                      <div className="w-8 h-8 bg-neo-green border-2 border-black flex items-center justify-center flex-shrink-0 ml-4">
                        <Check className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            <Card color="cyan" className="mt-8">
              <div className="flex items-start">
                <Sparkles className="w-6 h-6 mr-3 flex-shrink-0" />
                <div>
                  <p className="font-bold mb-2">Pro Tip</p>
                  <p className="text-sm">
                    Free tier includes 100 AI requests per month. Upgrade to Pro for unlimited usage.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Step 5: Download & Final Setup */}
        {step === 5 && (
          <div className="animate-slide-up">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              You're all set! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Download Nexus and start coding in flow.
            </p>

            <div className="space-y-6">
              <Card color="yellow" className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-2xl mb-2">Download Nexus</h3>
                  <p className="text-gray-700">
                    macOS • Linux • Windows
                  </p>
                </div>
                <Button variant="primary" size="lg">
                  <Download className="w-5 h-5 mr-2" />
                  Download
                </Button>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card color="cyan" hover>
                  <MessageCircle className="w-10 h-10 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Join Discord</h3>
                  <p className="text-gray-700 mb-4">
                    Connect with the community and get help from other developers.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Join Server
                  </Button>
                </Card>

                <Card color="pink" hover>
                  <Terminal className="w-10 h-10 mb-4" />
                  <h3 className="font-bold text-xl mb-2">Quick Start Guide</h3>
                  <p className="text-gray-700 mb-4">
                    Learn the essential shortcuts and features to boost productivity.
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Guide
                  </Button>
                </Card>
              </div>

              <Card color="white">
                <h3 className="font-bold text-xl mb-4">Your Configuration</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200">
                    <span className="text-gray-600">Role:</span>
                    <span className="font-bold">
                      {roles.find((r) => r.id === selections.role)?.label || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200">
                    <span className="text-gray-600">Languages:</span>
                    <span className="font-bold">
                      {selections.languages.length} selected
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-3 border-b-2 border-gray-200">
                    <span className="text-gray-600">Theme:</span>
                    <span className="font-bold">
                      {themes.find((t) => t.id === selections.theme)?.label || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Provider:</span>
                    <span className="font-bold">
                      {aiProviders.find((p) => p.id === selections.aiProvider)?.label || 'Not selected'}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12">
          <Button
            onClick={handleBack}
            variant="outline"
            size="lg"
            disabled={step === 1}
            className="min-w-[150px]"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            variant="primary"
            size="lg"
            className="min-w-[150px]"
          >
            {step === totalSteps ? (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Get Started
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip Option */}
        {step < totalSteps && (
          <div className="text-center mt-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-black font-bold underline"
            >
              Skip setup for now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
