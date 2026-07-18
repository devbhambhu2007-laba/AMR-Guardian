import React from 'react';
import { NavLink } from 'react-router-dom';
import Disclaimer from '../Disclaimer/Disclaimer';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="sticky top-0 z-40 bg-navy-900/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <NavLink to="/" className="text-xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
            AMR Awareness
          </NavLink>
          <nav className="flex gap-6">
            <NavLink to="/" className={({isActive}) => `text-sm font-medium transition-colors hover:text-teal-400 ${isActive ? 'text-teal-400' : 'text-slate-300'}`}>Home</NavLink>
            <NavLink to="/assessment" className={({isActive}) => `text-sm font-medium transition-colors hover:text-teal-400 ${isActive ? 'text-teal-400' : 'text-slate-300'}`}>Assessment</NavLink>
            <NavLink to="/learn" className={({isActive}) => `text-sm font-medium transition-colors hover:text-teal-400 ${isActive ? 'text-teal-400' : 'text-slate-300'}`}>Learn</NavLink>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow flex flex-col">
        {children}
      </main>

      <Disclaimer variant="banner" />
    </div>
  );
}
