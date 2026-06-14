'use client';

import { Icon } from '@iconify/react';
import { useTheme } from '@/components/layout/ThemeProvider';

export default function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[#e7e2d9] bg-white/90 px-4 py-2 text-sm font-medium text-text shadow-sm transition hover:border-gold hover:text-gold dark:bg-[#1a1a1a] dark:text-white"
    >
      <Icon icon={theme === 'dark' ? 'mdi:weather-sunny' : 'mdi:weather-night'} width="18" />
      {theme === 'dark' ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
