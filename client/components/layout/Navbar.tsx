'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { MobileMenu } from './MobileMenu';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold text-white hover:text-primary-200 transition-colors">
            GamesDB
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/games" className="text-gray-300 hover:text-white transition-colors">
              Games
            </Link>
            {user ? (
              <>
                <Link href="/submit" className="text-gray-300 hover:text-white transition-colors">
                  Submit Time
                </Link>
                <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  My Library
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/submissions" className="text-gray-300 hover:text-white transition-colors">
                    Admin
                  </Link>
                )}
                <Link href="/games/new" className="text-gray-300 hover:text-white transition-colors">
                  Add Game
                </Link>
                <button 
                  onClick={logout} 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                  Login
                </Link>
                <Link href="/register" className="text-gray-300 hover:text-white transition-colors">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <MobileMenu />
        </div>
      </div>
    </nav>
  );
}