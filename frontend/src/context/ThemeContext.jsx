import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_PRESETS = [
  { id: 'dark-glass', name: 'Dark Glass', icon: '🌌', bg: '#070913', accent: '#8b5cf6' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', icon: '⚡', bg: '#050811', accent: '#00f0ff' },
  { id: 'slate-indigo', name: 'Slate & Indigo', icon: '💼', bg: '#0f172a', accent: '#6366f1' },
  { id: 'light-minimal', name: 'Minimalist Light', icon: '☀️', bg: '#f8fafc', accent: '#7c3aed' }
];

export const ThemeProvider = ({ children }) => {
  const [activePreset, setActivePreset] = useState(() => {
    return localStorage.getItem('themePreset') || 'dark-glass';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing preset classes
    THEME_PRESETS.forEach((p) => root.classList.remove(`theme-${p.id}`));
    
    // Apply selected theme preset class
    root.classList.add(`theme-${activePreset}`);

    if (activePreset === 'light-minimal') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    localStorage.setItem('themePreset', activePreset);
  }, [activePreset]);

  return (
    <ThemeContext.Provider value={{ activePreset, setActivePreset, presets: THEME_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
