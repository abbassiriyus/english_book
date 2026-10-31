import React, { useState } from 'react';
import { ROUND_UP_PAGES } from '../data/roundupPages';
import { ROUND_UP_APPROXIMATE } from '../data/roundupApprox';

export default function RoundUp({ lesson, ui, lang }) {
  const ranges = ROUND_UP_PAGES[lesson.n] || [[134, 157]];
  const [rangeIdx, setRangeIdx] = useState(0);
  const [page, setPage] = useState(ranges[0][0]);

  const range = ranges[rangeIdx];
  const currentPage = Math.max(range[0], Math.min(page, range[1]));
  const isApprox = ROUND_UP_APPROXIMATE.has(lesson.n);

  const copy = {
    uz: {
      roundupTitle: "Round Up 2 · kitob topshiriqlari",
      roundupTip: "Mavzuga mos betni tanlab, topshiriqlarni kitobning o'ziida bajaring.",
      approximate: "Bu mavzu alohida sarlavha bilan yo'q. Eng yaqin mavzu yoki takrorlash betlari tanlandi.",
      pages: "Kitob betlari",
      page: "Bet",
      pageRange: "Betlar",
      openPdf: "PDF'ni alohida ochish",
    },
    ru: {
      roundupTitle: "Round Up 2 · задания из книги",
      roundupTip: "Выберите подходящую страницу и выполняйте задания в самой книге.",
      approximate: "Этой темы нет отдельным заголовком. Показаны страницы ближайшей темы или повторения.",
      pages: "Страницы книги",
      page: "Страница",
      pageRange: "Страницы",
      openPdf: "Открыть PDF отдельно",
    },
  }[lang];

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="flex items-center gap-2 mb-3">
          <span>📖</span> {copy.roundupTitle}
        </h3>
        <p className="text-sm text-muted mb-3">{copy.roundupTip}</p>
        <p className={`text-xs p-3 rounded bg-[var(--ask-bg)] ${isApprox ? '' : 'hidden'}`}>
          {copy.approximate}
        </p>
        {!isApprox && (
          <p className="text-xs p-3 rounded bg-[var(--line)] text-muted">
            {copy.pages}
          </p>
        )}
        <div className="roundup-pages flex gap-2 flex-wrap mb-3">
          {ranges.map((pages, i) => (
            <button
              key={i}
              onClick={() => { setRangeIdx(i); setPage(pages[0]); }}
              className={`px-3 py-1.5 rounded border text-sm transition ${i === rangeIdx ? 'bg-[var(--brand)] border-[var(--brand)] text-white' : 'bg-[var(--bg)] border-[var(--line)] text-[var(--ink)]'}`}
            >
              {pages[0] === pages[1] ? `${copy.page} ${pages[0]}` : `${copy.pageRange} ${pages[0]}–${pages[1]}`}
            </button>
          ))}
          <button
            onClick={() => { setPage(p => Math.max(range[0], p - 1)); }}
            disabled={currentPage <= range[0]}
            className="px-3 py-1.5 rounded border text-sm transition disabled:opacity-50"
            title={lang === "uz" ? "Oldingi bet" : "Предыдущая страница"}
          >
            ←
          </button>
          <span className="px-2 text-xs text-muted">{copy.page} {currentPage} / {range[1]}</span>
          <button
            onClick={() => { setPage(p => Math.min(range[1], p + 1)); }}
            disabled={currentPage >= range[1]}
            className="px-3 py-1.5 rounded border text-sm transition disabled:opacity-50"
            title={lang === "uz" ? "Keyingi bet" : "Следующая страница"}
          >
            →
          </button>
        </div>
        <a
          href={`New%20Round%20up%202.pdf#page=${currentPage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn alt"
        >
          📄 {copy.openPdf}
        </a>
      </div>
      <div className="roundup-viewer border border-line rounded-lg bg-white h-[70vh] flex items-center justify-center text-muted">
        PDF viewer would go here. Open PDF to page {currentPage}.
      </div>
    </div>
  );
}