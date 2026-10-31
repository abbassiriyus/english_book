import React, { useState, useEffect, useCallback } from 'react';
import { ALL } from './data/lessons';
import TopBar from './components/TopBar';
import Nav from './components/Nav';
import LessonContent from './components/LessonContent';
import RoundUp from './components/RoundUp';
import Whiteboard from './components/Whiteboard';
import ErrorBoundary from './components/ErrorBoundary';
import { useStorage } from './hooks/useStorage';

const TABS_ORDER = ["explain", "formula", "examples", "dialog", "test", "roundup", "baamboozle", "vocab", "say", "team", "hw", "review"];

function tabsFor(lesson) {
  const t = [];
  if (lesson.explain && lesson.explain.length) t.push("explain");
  if (lesson.formula && lesson.formula.length) t.push("formula");
  if (lesson.ex && Object.keys(lesson.ex).length) t.push("examples");
  if (lesson.dlg && lesson.dlg.length) t.push("dialog");
  if (lesson.tests && lesson.tests.length) t.push("test");
  t.push("roundup");
  t.push("baamboozle");
  t.push("vocab");
  t.push("say");
  t.push("team");
  t.push("hw");
  if (lesson.review) t.push("review");
  return t;
}

export default function App() {
  const [lang, setLang] = useState("uz");
  const [theme, setTheme] = useState("light");
  const [fs, setFs] = useState("3");
  const [cur, setCur] = useState(1);
  const [tab, setTab] = useState("explain");
  const [menuOpen, setMenuOpen] = useState(false);

  const langStorage = useStorage("lang", "uz");
  const themeStorage = useStorage("theme", "light");
  const fsStorage = useStorage("fs", "3");

  useEffect(() => {
    const l = langStorage.get();
    if (ALL[l]) setLang(l);
  }, []);

  useEffect(() => {
    const t = themeStorage.get();
    if (t === "light" || t === "dark") setTheme(t);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const f = fsStorage.get();
    if (["1","2","3","4","5"].includes(f)) setFs(f);
    document.body.setAttribute("data-fs", fs);
  }, [fs]);

  const D = ALL[lang];
  const UI = D?.ui;
  const lessonIdx = (n) => D.lessons.findIndex(l => l.n === n);
  const idx = lessonIdx(cur);
  const lesson = idx >= 0 ? D.lessons[idx] : null;
  const lessonTabs = lesson ? tabsFor(lesson) : [];

  useEffect(() => {
    if (lesson && !lessonTabs.includes(tab)) {
      setTab(lessonTabs[0] || "explain");
    }
  }, [lesson, tab, lessonTabs]);

  const units = [];
  const unitMap = {};
  D.lessons.forEach(l => {
    const unitTitle = l.unit || "Asosiy";
    if (!unitMap[unitTitle]) unitMap[unitTitle] = [];
    unitMap[unitTitle].push(l);
  });
  Object.keys(unitMap).forEach(title => units.push({ title, lessons: unitMap[title] }));

  const go = useCallback((n, t) => {
    setCur(n);
    if (t) setTab(t);
    setMenuOpen(false);
  }, []);

  const selectTab = useCallback((t) => {
    setTab(t);
    setMenuOpen(false);
  }, []);

  const langName = lang === "uz" ? "O'zbek tilida" : "Русский";
  const course = UI?.course || "Ingliz tili kursi";
  const courseSub = UI?.course_sub || "";

  // Render content based on tab
  let content = null;
  if (tab === "roundup" && lesson) {
    content = <RoundUp lesson={lesson} ui={UI} lang={lang} />;
  } else if (tab === "whiteboard") {
    content = <Whiteboard />;
  } else if (lesson) {
    content = <LessonContent lesson={lesson} ui={UI} lang={lang} />;
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--ink)]">
      <TopBar
        course={course}
        courseSub={courseSub}
        langName={langName}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        fs={fs}
        setFs={setFs}
      />
      <div className="layout flex h-[calc(100vh-56px)]">
        <Nav
          units={units}
          currentUnit={null}
          currentLesson={cur}
          onSelectUnit={() => {}}
          onSelectLesson={go}
          onSelectTab={selectTab}
          tabs={tabsFor}
          currentTab={tab}
          ui={UI}
        />
        <div className="flex-1 overflow-auto p-2">
          {menuOpen ? (
            <div className="card p-4 m-2 max-w-md mx-auto">
              <h2 className="text-lg font-bold mb-4">{UI?.menu || 'Mavzular'}</h2>
              <div className="space-y-2">
                {units.map((unit) => (
                  <div key={unit.title} className="mb-3">
                    <div className="text-xs font-bold text-muted uppercase tracking-wide mb-2">{unit.title}</div>
                    <div className="space-y-1">
                      {unit.lessons.map((l) => (
                        <button
                          key={l.n}
                          onClick={() => go(l.n, tabsFor(l)[0])}
                          className="w-full text-left text-sm p-2 rounded hover:bg-[var(--bg)] transition"
                        >
                          {l.n}. {l.loc_title || l.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            content || <div className="card p-8 text-center text-muted">Dars topilmadi</div>
          )}
        </div>
      </div>
    </div>
  );
}