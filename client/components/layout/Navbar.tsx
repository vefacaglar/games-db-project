'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold">
            Playtime Tracker
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/games" className="hover:text-gray-300">
              Games
            </Link>
            {user ? (
              <>
                <Link href="/submit" className="hover:text-gray-300">
                  Submit Time
                </Link>
                <Link href="/dashboard" className="hover:text-gray-300">
                  My Library
                </Link>
                {user.role === 'admin' && (
                  <Link href="/admin/submissions" className="hover:text-gray-300">
                    Admin
                  </Link>
                )}
                <Link href="/games/new" className="hover:text-gray-300">
                  Add Game
                </Link>
                <button onClick={logout} className="hover:text-gray-300">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-gray-300">
                  Login
                </Link>
                <Link href="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}