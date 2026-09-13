export type TextLanguage =
  | 'und-Latn'
  | 'und-Cyrl'
  | 'und-Grek'
  | 'si'
  | 'und-Deva'
  | 'und-Arab'
  | 'zh-Hans'
  | 'ja'
  | 'ko'

const SCRIPT_PATTERNS = {
  japanese: /\p{Script=Hiragana}|\p{Script=Katakana}/u,
  korean: /\p{Script=Hangul}/u,
  sinhala: /\p{Script=Sinhala}/u,
  devanagari: /\p{Script=Devanagari}/u,
  arabic: /\p{Script=Arabic}/u,
  han: /\p{Script=Han}/u,
  cyrillic: /\p{Script=Cyrillic}/u,
  greek: /\p{Script=Greek}/u,
}

export function detectTextLanguage(text: string): TextLanguage {
  if (SCRIPT_PATTERNS.japanese.test(text)) return 'ja'
  if (SCRIPT_PATTERNS.korean.test(text)) return 'ko'
  if (SCRIPT_PATTERNS.sinhala.test(text)) return 'si'
  if (SCRIPT_PATTERNS.devanagari.test(text)) return 'und-Deva'
  if (SCRIPT_PATTERNS.arabic.test(text)) return 'und-Arab'
  if (SCRIPT_PATTERNS.han.test(text)) return 'zh-Hans'
  if (SCRIPT_PATTERNS.cyrillic.test(text)) return 'und-Cyrl'
  if (SCRIPT_PATTERNS.greek.test(text)) return 'und-Grek'
  return 'und-Latn'
}

export function getTextAttributes(text: string): { lang: TextLanguage; dir: 'auto' } {
  return { lang: detectTextLanguage(text), dir: 'auto' }
}
