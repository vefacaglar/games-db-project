'use client';

import { ReactNode } from 'react';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-8 mt-auto">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">GamesDB</h3>
              <p className="text-gray-400">Track your gaming journey, discover new games, and connect with other gamers.</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="/games" className="text-gray-400 hover:text-white transition-colors">Games</a></li>
                <li><a href="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="/submit" className="text-gray-400 hover:text-white transition-colors">Submit Playtime</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Account</h4>
              <ul className="space-y-2">
                <li><a href="/login" className="text-gray-400 hover:text-white transition-colors">Login</a></li>
                <li><a href="/register" className="text-gray-400 hover:text-white transition-colors">Register</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} GamesDB. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}