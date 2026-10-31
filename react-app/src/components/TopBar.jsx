import React, { useState } from 'react';
import { Menu, Sun, Moon, FontSize, Globe, Info } from 'lucide-react';

export default function TopBar({ course, courseSub, langName, lang, setLang, theme, setTheme, fs, setFs }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="top sticky top-0 z-30 flex gap-2 items-center px-4 py-3 shadow-lg">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="mr-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition"
        aria-label="Menu"
      >
        <Menu size={20} />
      </button>
      <h1 className="flex-1 min-w-0 text-sm font-bold truncate">
        {course}
        <small className="block font-normal opacity-80 text-xs">{langName} · {courseSub}</small>
      </h1>
      <div className="flex gap-2">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="chip px-3 py-1 text-xs"
          title={theme === 'dark' ? 'Yorqin rejim' : 'Qorongu rejim'}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <button
          onClick={() => setFs(String(Math.min(5, Math.max(1, Number(fs) + 1)) || 3))}
          className="chip px-3 py-1 text-xs"
          title="Katta shrift"
        >
          <FontSize size={16} />
        </button>
        <button
          onClick={() => setLang(lang === 'uz' ? 'ru' : 'uz')}
          className="chip px-3 py-1 text-xs"
          title="Tilni o'zgartirish"
        >
          <Globe size={16} />
          {lang === 'uz' ? ' RU' : ' UZ'}
        </button>
      </div>
    </header>
  );
}