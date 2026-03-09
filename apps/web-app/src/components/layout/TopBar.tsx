'use client';

import { User } from 'lucide-react';

export function TopBar() {
  return (
    <header className="top-bar">
      <h1 className="top-bar__logo">NOVA</h1>
      <button className="top-bar__avatar" aria-label="User profile">
        <User size={18} />
      </button>
    </header>
  );
}
