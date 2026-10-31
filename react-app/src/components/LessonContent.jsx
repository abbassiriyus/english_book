import React, { useEffect, useRef } from 'react';
import { renderKatex } from '../utils/katex';

const SYMBOL_LABELS = {
  '+': 'Darak (+)',
  '-': 'Inkor (−)',
  '?': "So'roq (?)",
  '*': 'Qoida',
};

const PART_LABELS = {
  S: 'Ega (Subject)',
  V: "Fe'l (V1)",
  V2: "Fe'l (V2)",
  V3: "Fe'l (V3)",
  ING: "Fe'l + ing",
  O: 'Ot / to\'ldiruvchi',
  AUX: 'Yordamchi fe\'l',
  MOD: 'Modal fe\'l',
  NEG: 'Inkor (not)',
  X: 'Payt / joy / so\'z',
  Q: "So\'roq so\'zi",
  ADJ: 'Sifat',
  PREP: 'Predlog',
  ART: 'Artikl',
  TO: 'to',
  IF: 'Shart (if)',
  CONJ: "Bog\'lovchi",
  PL: 'Qo\'shimcha',
  NUM: 'Son / miqdor',
  TAG: "Qo\'shimcha savol",
  DET: "Ko\'rsatish so\'zi",
  POS: 'Egalik so\'zi',
  PRO: 'Olmosh',
  LET: 'Harf',
  SND: 'Tovush',
  WORD: 'So\'z',
};

export default function LessonContent({ lesson, ui, lang }) {
  const contentRef = useRef(null);

  useEffect(() => {
    renderKatex(contentRef.current);
  }, [lesson]);
  const renderExplain = () => {
    if (!lesson.explain || lesson.explain.length === 0) return null;
    return (
      <div className="card" key="explain">
        <h3 className="flex items-center gap-2 mb-3">
          <span>💡</span> {ui.explain_h || 'Tushuntirish'}
        </h3>
        <div className="space-y-3">
          {lesson.explain.map((t, i) => (
            <p key={i} className="text-sm leading-relaxed">{t}</p>
          ))}
        </div>
      </div>
    );
  };
  const renderFormula = () => {
    if (!lesson.formula || lesson.formula.length === 0) return null;
    return (
      <div className="card" key="formula">
        <h3 className="flex items-center gap-2 mb-3">
          <span>🧩</span> {ui.formula_h || 'Formulalar'}
        </h3>
        <div className="flex flex-wrap gap-3">
          {lesson.formula.map(([sym, text]) => (
            <div key={text} className="fbox p-3 rounded border bg-[var(--bg)] text-sm">
              <span className="font-bold mr-2">{SYMBOL_LABELS[sym] || sym}</span>
              <span className="break-all">{text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  const renderDialog = () => {
    if (!lesson.dlg || lesson.dlg.length === 0) return null;
    return (
      <div className="card" key="dialog">
        <h3 className="flex items-center gap-2 mb-3">
          <span>💬</span> {ui.dialog_h || 'Dialog'}
        </h3>
        <div className="chat space-y-3">
          {lesson.dlg.map(([sp, en, loc], i) => {
            const side = sp.toUpperCase() === 'A' ? 'a' : 'b';
            return (
              <div key={i} className={`chat-msg side-${side}`}>
                <div className="chat-bubble">{en}</div>
                {loc && (
                  <div className="chat-bubble translation">— {loc}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTest = () => {
    if (!lesson.tests || lesson.tests.length === 0) return null;
    return (
      <div className="card" key="test">
        <h3 className="flex items-center gap-2 mb-3">
          <span>📝</span> {ui.test_h || 'Test'}
        </h3>
        {lesson.tests.map((questions, qi) => (
          <div key={qi} className="mb-4 p-3 bg-[var(--bg)] rounded border border-line">
            <p className="text-sm font-semibold mb-3">Test {qi + 1}</p>
            {questions.map((q, qi2) => (
              <div key={qi2} className="mb-3">
                <p className="text-sm font-medium">{q.q}</p>
                {q.o.map((opt, oi) => (
                  <label key={oi} className="block text-sm mb-1 cursor-pointer select-none">
                    <input
                      type="radio"
                      name={`test-${qi}-${qi2}`}
                      className="mr-2"
                      defaultChecked={q.a === oi}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const renderPics = () => {
    if (!lesson.pics || lesson.pics.length === 0) return null;
    return (
      <div className="card" key="pics">
        <h3 className="flex items-center gap-2 mb-3">
          <span>🖼️</span> {ui.pics_h || "Rasmli lug'at"}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {lesson.pics.map(([en, tr, loc], i) => (
            <div key={i} className="flex flex-col items-center gap-2 p-3 border border-line rounded bg-[var(--bg)]">
              <div className="w-16 h-16 rounded bg-[var(--line)] flex items-center justify-center text-muted">
                🖼️
              </div>
              <span className="text-sm font-medium">{en}</span>
              <span className="text-xs text-muted">{loc || ''}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDiagram = () => {
    if (!lesson.diagram || lesson.diagram.length === 0) return null;
    return (
      <div className="card" key="diagram">
        <h3 className="flex items-center gap-2 mb-3">
          <span>🧱</span> {ui.diagram_h || 'Gap qurilishi'}
        </h3>
        <p className="text-xs text-muted mb-3">{ui.diagram_tip || ''}</p>
        <div className="space-y-3">
          {lesson.diagram.map((d, i) => (
            <div key={i} className="p-3 border border-line rounded bg-[var(--bg)]">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-xs font-bold bg-white border">
                  {d.sym}
                </span>
                <span className="text-xs text-muted">➜ {d.tr}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {d.pat.map((c, ci) => (
                  <div key={ci} className="flex flex-col items-center gap-1 p-2 border rounded bg-card">
                    <span className="text-xs font-bold">{PART_LABELS[c[0]] || c[0]}</span>
                    <span className="text-xs">{c[1]}</span>
                    <span className="text-xs text-muted">⬇</span>
                    <span className="text-[10px]">{d.ex?.[ci]?.[1] || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFix = () => {
    if (!lesson.fix || lesson.fix.length === 0) return null;
    return (
      <div className="card" key="fix">
        <h3 className="flex items-center gap-2 mb-3">
          <span>🔍</span> {ui.fix_h || "Xatoni top"}
        </h3>
        <div className="space-y-3">
          {lesson.fix.map(([wrong, right], i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-red-600 shrink-0">✗</span>
              <span className="line-through text-muted">{wrong}</span>
              <span className="ml-2 text-green-600 font-medium">{right}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderFill = () => {
    if (!lesson.fill || lesson.fill.length === 0) return null;
    return (
      <div className="card" key="fill">
        <h3 className="flex items-center gap-2 mb-3">
          <span>✏️</span> {ui.fill_h || "To'ldiring"}
        </h3>
        <div className="space-y-3">
          {lesson.fill.map(([question, answers], i) => (
            <div key={i} className="text-sm">
              <p className="mb-1">{question}</p>
              <div className="flex gap-2">
                {answers.map((ans, ai) => (
                  <span key={ai} className="px-2 py-1 rounded bg-[var(--line)] text-xs font-medium">{ans}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSay = () => {
    if (!lesson.say || lesson.say.length === 0) return null;
    return (
      <div className="card" key="say">
        <h3 className="flex items-center gap-2 mb-3">
          <span>🗣️</span> {ui.say_h || 'Amaliy gaplar'}
        </h3>
        <div className="space-y-2">
          {lesson.say.map(([en, loc], i) => (
            <div key={i} className="flex justify-between items-start text-sm border-b border-line pb-2 last:border-0">
              <span>{en}</span>
              <span className="text-muted">{loc}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderHw = () => {
    if (!lesson.hw || lesson.hw.length === 0) return null;
    return (
      <div className="card" key="hw">
        <h3 className="flex items-center gap-2 mb-3">
          <span>📝</span> {ui.hw_h || 'Uyga vazifa'}
        </h3>
        <div className="space-y-2 text-sm">
          {lesson.hw.map((t, i) => (
            <div key={i} className="flex gap-2">
              <span className="text-[12px] font-bold text-muted">{i + 1}.</span>
              <span>{t}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReview = () => {
    if (!lesson.review) return null;
    return (
      <div className="card" key="review">
        <h3 className="flex items-center gap-2 mb-3">
          <span>🔄</span> {ui.review_h || 'Takrorlash'}
        </h3>
        <div className="text-sm space-y-2">
          {lesson.review.map((t, i) => (
            <p key={i}>{t}</p>
          ))}
        </div>
      </div>
    );
  };

  const renderExamples = () => {
    if (!lesson.ex || Object.keys(lesson.ex).length === 0) return null;
    return (
      <div className="card" key="examples">
        <h3 className="flex items-center gap-2 mb-3">
          <span>📝</span> {Object.keys(lesson.ex).length ? (ui.ex_h && ui.ex_h['*']) || 'Misollar' : 'Misollar'}
        </h3>
        <div className="space-y-3">
          {Object.entries(lesson.ex).map(([sym, pairs]) => (
            <div key={sym} className="mb-2">
              <h4 className="text-xs font-bold text-muted uppercase mb-1">
                {SYMBOL_LABELS[sym] || sym}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {pairs.map(([en, loc], i) => (
                  <div key={i} className="p-2 rounded bg-[var(--line)]">
                    <div className="font-medium">{en}</div>
                    <div className="text-[12px] text-muted">— {loc}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="p-4" ref={contentRef}>
      {renderExplain()}
      {renderFormula()}
      {renderExamples()}
      {renderDialog()}
      {renderTest()}
      {renderPics()}
      {renderDiagram()}
      {renderFix()}
      {renderFill()}
      {renderSay()}
      {renderHw()}
      {renderReview()}
    </main>
  );
}
