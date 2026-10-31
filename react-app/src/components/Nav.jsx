import React from 'react';
import { BookOpen, CheckCircle, FileText, GraduationCap, Home, Users } from 'lucide-react';

const TAB_ICONS = {
  explain: <BookOpen size={16} />,
  formula: <FileText size={16} />,
  examples: <CheckCircle size={16} />,
  dialog: <Users size={16} />,
  test: <GraduationCap size={16} />,
  say: <Home size={16} />,
  team: <Users size={16} />,
  hw: <GraduationCap size={16} />,
  review: <CheckCircle size={16} />,
  roundup: <BookOpen size={16} />,
  baamboozle: <GraduationCap size={16} />,
  vocab: <FileText size={16} />,
};

export default function Nav({ units, currentUnit, currentLesson, onSelectUnit, onSelectLesson, onSelectTab, tabs, currentTab, ui }) {
  return (
    <nav className="sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-3 border-r border-line bg-card">
      {units.map((unit) => (
        <div key={unit.title} className="mb-2 ml-1">
          <div className="text-[10px] tracking-wider uppercase text-muted font-bold mb-1">{unit.title}</div>
          {unit.lessons.map((lesson) => {
            const isActive = currentLesson === lesson.n;
            const lessonTabs = tabs(lesson);
            return (
              <button
                key={lesson.n}
                onClick={() => onSelectLesson(lesson.n, lessonTabs[0])}
                className={`nav-btn w-full ${isActive ? 'on' : ''}`}
              >
                <span className="w-8 h-8 rounded-lg bg-[var(--bg)] flex items-center justify-center flex-shrink-0 font-bold text-[10px]">
                  {lesson.n}
                </span>
                <span className="truncate">{lesson.loc_title || lesson.title}</span>
              </button>
            );
          })}
        </div>
      ))}
    </nav>
  );
}