import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-cyber-darker via-cyber-dark to-cyber-darker">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center space-y-8">
          {/* Logo/Title with Glitch Effect */}
          <h1 className="text-7xl font-bold mb-4">
            <span className="text-neon-green neon-text">Founder</span>
            <span className="text-neon-pink neon-text">Mind</span>
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-neon-blue max-w-3xl mx-auto">
            The AI-Powered Startup Simulation & Decision Engine
          </p>

          {/* Description */}
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Run virtual startups with AI-powered board members and advisors.
            Learn from failures, test ideas, and develop entrepreneurial skills
            without risking real capital.
          </p>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center items-center pt-8">
            <Link href="/dashboard" className="cyber-button text-lg">
              Try Demo →
            </Link>
            <Link href="/advisors" className="border border-neon-pink text-neon-pink px-6 py-3 rounded hover:bg-neon-pink/10 transition-all duration-300">
              Meet Advisors
            </Link>
            <Link
              href="/login"
              className="border border-neon-blue text-neon-blue px-6 py-3 rounded hover:bg-neon-blue/10 transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="cyber-card hover:border-neon-green/50 transition-all duration-300">
            <div className="text-neon-green text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-bold text-neon-green mb-2">AI Board of Advisors</h3>
            <p className="text-gray-400">
              Get strategic guidance from AI personas based on real startup wisdom.
              CEO, CTO, CFO, CMO, and Investor advisors at your service.
            </p>
          </div>

          <div className="cyber-card hover:border-neon-pink/50 transition-all duration-300">
            <div className="text-neon-pink text-4xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-neon-pink mb-2">Realistic Simulation</h3>
            <p className="text-gray-400">
              Face real startup challenges, manage burn rate, hire teams,
              and compete in dynamic markets that respond to your decisions.
            </p>
          </div>

          <div className="cyber-card hover:border-neon-blue/50 transition-all duration-300">
            <div className="text-neon-blue text-4xl mb-4">⚔️</div>
            <h3 className="text-xl font-bold text-neon-blue mb-2">Multiplayer Battles</h3>
            <p className="text-gray-400">
              Compete against other founders in the same market.
              Poach employees, race to milestones, and negotiate acquisitions.
            </p>
          </div>

          <div className="cyber-card hover:border-neon-green/50 transition-all duration-300">
            <div className="text-neon-green text-4xl mb-4">📚</div>
            <h3 className="text-xl font-bold text-neon-green mb-2">Learn from Legends</h3>
            <p className="text-gray-400">
              Replay famous startup stories like Airbnb and Uber.
              Learn what worked, what didn&apos;t, and why.
            </p>
          </div>

          <div className="cyber-card hover:border-neon-pink/50 transition-all duration-300">
            <div className="text-neon-pink text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-neon-pink mb-2">Safe to Fail</h3>
            <p className="text-gray-400">
              Make mistakes without real consequences.
              Learn from failures and iterate on your strategy.
            </p>
          </div>

          <div className="cyber-card hover:border-neon-blue/50 transition-all duration-300">
            <div className="text-neon-blue text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-neon-blue mb-2">Real Value</h3>
            <p className="text-gray-400">
              Export pitch decks, financial models, and business strategies
              to use in your actual startup.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-5xl font-bold text-neon-green neon-text">582M+</div>
            <div className="text-gray-400 mt-2">Entrepreneurs Worldwide</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-neon-pink neon-text">$100B+</div>
            <div className="text-gray-400 mt-2">Startup Education Market</div>
          </div>
          <div>
            <div className="text-5xl font-bold text-neon-blue neon-text">∞</div>
            <div className="text-gray-400 mt-2">Possibilities to Explore</div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-20 text-center text-gray-500">
          <p>Built with ❤️ for aspiring founders everywhere</p>
          <p className="mt-2 text-sm">
            Powered by Next.js, Supabase, and OpenAI
          </p>
        </div>
      </div>
    </main>
  )
}
