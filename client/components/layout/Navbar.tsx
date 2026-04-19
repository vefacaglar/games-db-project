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
            GamesDB
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/games/new" className="hover:text-gray-300">
                  Add Game
                </Link>
                <Link href="/profile" className="hover:text-gray-300">
                  {user.username}
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