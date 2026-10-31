import katex from 'katex';
import { renderMathInElement } from 'katex/contrib/auto-render';

export function renderKatex(element) {
  if (!element) return;
  try {
    renderMathInElement(element, {
      delimiters: [
        { type: 'math', start: '\\(', end: '\\)', display: false },
        { type: 'math', start: '\\[', end: '\\]', display: true },
      ],
      throwOnError: false,
    });
  } catch (e) {
    console.warn('KaTeX render error:', e);
  }
}

export function renderKatexString(latex) {
  try {
    return katex.renderToString(latex, { throwOnError: false });
  } catch (e) {
    return `<span style="color:red">${latex}</span>`;
  }
}