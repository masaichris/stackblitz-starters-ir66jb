'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'
import { ThemeToggle } from './ThemeToggle'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'

export function Navigation() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user || pathname === '/login') return null

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { href: '/transactions', label: 'Transactions', icon: ChartBarIcon },
    { href: '/commissions', label: 'Commissions', icon: CurrencyDollarIcon },
  ]

  return (
    <nav className="bg-background border-b h-16">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">MMM</span>
            </div>
            <div className="hidden sm:flex sm:space-x-8">
              {navItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${
                    pathname === href
                      ? 'border-primary text-foreground'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  <Icon className="h-5 w-5 mr-1" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button
              onClick={logout}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}