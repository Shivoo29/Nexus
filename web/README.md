# Nexus Web Platform

> **Neo Brutalism Design • Full User Journey • Clear Messaging**

The official web platform for Nexus - the AI-native code editor that doesn't suck.

---

## 🎨 Design Philosophy

This platform follows **Neo Brutalism** design principles:

- **Bold, thick borders** (4px black borders everywhere)
- **Strong shadows** (offset box shadows for depth)
- **Vibrant colors** (yellow, cyan, pink, purple, green)
- **Clear typography** (Space Grotesk for headings, Inter for body, JetBrains Mono for code)
- **No gradients or subtle effects** (what you see is what you get)
- **Playful but functional** (fun without sacrificing usability)

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**

### Installation

```bash
# Navigate to web directory
cd web

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the site.

---

## 📁 Project Structure

```
web/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   ├── signup/            # Sign up page
│   │   ├── login/             # Login page
│   │   ├── onboarding/        # Onboarding flow
│   │   ├── pricing/           # Pricing page
│   │   ├── features/          # Features page
│   │   ├── docs/              # Documentation
│   │   └── contact/           # Contact page
│   │
│   └── components/            # Reusable components
│       ├── Navigation.tsx     # Top navigation
│       ├── Footer.tsx         # Footer
│       ├── Button.tsx         # Neo brutalism button
│       └── Card.tsx           # Neo brutalism card
│
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript config
├── next.config.js            # Next.js config
└── package.json              # Dependencies
```

---

## 🎯 Key Features

### Complete User Journey

1. **Landing Page** → Clear value proposition, features, testimonials, pricing
2. **Sign Up** → Social login (GitHub/Discord) or email, trust signals
3. **Onboarding** → 5-step guided setup (role, languages, theme, AI, download)
4. **Features** → Detailed feature showcase with comparisons
5. **Pricing** → Transparent pricing with FAQs
6. **Documentation** → Comprehensive guides and API docs
7. **Contact** → Multiple support channels

### Neo Brutalism Components

- **Button** → 4 variants (primary, secondary, outline, ghost) with shadow animations
- **Card** → 6 color options with hover effects
- **Navigation** → Sticky header with mobile menu
- **Footer** → Comprehensive footer with newsletter signup

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Hamburger menu for mobile
- Responsive grids and spacing

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server (hot reload)

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

### Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Fonts**: Google Fonts (Inter, Space Grotesk, JetBrains Mono)

---

## 🎨 Design System

### Colors

```css
neo-yellow: #FFED4E
neo-cyan: #00F5FF
neo-pink: #FF6B9D
neo-green: #00FF94
neo-purple: #B794F6
neo-orange: #FF8C42
neo-black: #000000
neo-white: #FFFFFF
```

### Shadows

```css
neo-shadow-sm: 4px 4px 0px 0px rgba(0,0,0,1)
neo-shadow: 8px 8px 0px 0px rgba(0,0,0,1)
neo-shadow-lg: 12px 12px 0px 0px rgba(0,0,0,1)
```

### Typography

- **Display**: Space Grotesk (headings, bold statements)
- **Body**: Inter (paragraphs, UI text)
- **Code**: JetBrains Mono (code snippets, technical content)

---

## 📄 Pages Overview

### Landing Page (`/`)
- Hero with clear value proposition
- Problem/solution section
- Features grid
- Testimonials
- Pricing preview
- CTA sections

### Sign Up (`/signup`)
- Social login (GitHub, Discord)
- Email/password form
- Benefits sidebar
- Trust signals (SOC 2, GDPR, SSL)

### Onboarding (`/onboarding`)
- 5-step guided setup
- Progress indicator
- Configuration summary
- Download CTA

### Pricing (`/pricing`)
- 3 tiers (Free, Pro, Enterprise)
- Feature comparison
- Detailed comparison table
- FAQ section

### Features (`/features`)
- Main features showcase
- Performance comparisons
- All features grid
- Interactive demos

### Documentation (`/docs`)
- Search functionality
- Categorized sections
- Quick links
- Support CTAs

### Contact (`/contact`)
- Multiple contact methods
- Contact form
- Office locations
- Social links

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms

This is a standard Next.js app and can be deployed to:
- **Netlify**
- **AWS Amplify**
- **Cloudflare Pages**
- **Self-hosted** (Docker)

---

## 🎯 User Experience Goals

1. **Clear Messaging**: Users should understand what Nexus is in 5 seconds
2. **Seamless Journey**: From landing → signup → onboarding → using the product
3. **No Friction**: Social login, skip options, sensible defaults
4. **Trust Signals**: SOC 2, open source, testimonials, transparent pricing
5. **Delightful Design**: Neo brutalism makes it memorable and fun

---

## 📊 Performance

- **Lighthouse Score**: 95+ (target)
- **First Contentful Paint**: <1s
- **Time to Interactive**: <2s
- **Bundle Size**: <200KB (initial)

---

## 🔒 Security

- **No sensitive data** stored client-side
- **HTTPS only** in production
- **Content Security Policy** configured
- **XSS protection** via React's default escaping
- **CSRF tokens** for form submissions (production)

---

## 🤝 Contributing

See main [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

For web-specific contributions:
1. Follow Neo Brutalism design principles
2. Maintain component consistency
3. Test on mobile and desktop
4. Keep bundle size small

---

## 📝 TODO

- [ ] Add animations with Framer Motion
- [ ] Implement search functionality
- [ ] Add blog section
- [ ] Create changelog page
- [ ] Add analytics (PostHog/Plausible)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Accessibility audit (WCAG 2.1 AA)

---

## 📞 Support

- **Discord**: [discord.gg/nexus-ide](https://discord.gg/nexus-ide)
- **Email**: hello@nexus-ide.dev
- **Issues**: [GitHub Issues](https://github.com/nexus-ide/nexus/issues)

---

**Built with ❤️ by the Nexus team**

*Stop context switching. Start coding in flow.* 🚀✨
