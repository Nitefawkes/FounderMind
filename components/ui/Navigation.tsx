'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/advisors', label: 'Advisors', icon: '🧠' },
    { href: '/compete', label: 'Compete', icon: '⚔️' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ]

  // Don't show nav on home/login/register pages
  if (pathname === '/' || pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return null
  }

  return (
    <nav className="bg-cyber-dark border-b border-neon-blue/30 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold">
              <span className="text-neon-green">Founder</span>
              <span className="text-neon-pink">Mind</span>
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.slice(1).map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded transition-all duration-300 ${
                    isActive
                      ? 'bg-neon-green/10 text-neon-green border border-neon-green/30'
                      : 'text-gray-400 hover:text-neon-blue hover:bg-cyber-gray'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span className="hidden md:inline text-sm">{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">
              <span className="text-neon-green">Level 1</span> Founder
            </div>
            <div className="w-10 h-10 bg-neon-blue/20 border border-neon-blue rounded-full flex items-center justify-center text-xl">
              👤
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
