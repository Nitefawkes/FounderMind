import Link from 'next/link'

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cyber-darker via-cyber-dark to-cyber-darker flex items-center justify-center p-4">
      <div className="cyber-card max-w-md w-full">
        <h1 className="text-3xl font-bold text-neon-green mb-2 neon-text">Start Your Journey</h1>
        <p className="text-gray-400 mb-8">Create your account and build your empire</p>

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Alex Founder"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="founder@startup.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="confirm" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm"
              className="w-full bg-cyber-darker border border-neon-blue/30 rounded px-4 py-3 text-white focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="w-full cyber-button">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-neon-green hover:underline">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link href="/" className="text-neon-blue hover:underline text-sm">
            ← Back to Home
          </Link>
        </p>
      </div>
    </div>
  )
}
