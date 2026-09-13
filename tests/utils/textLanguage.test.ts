import { describe, expect, it } from 'vitest'
import { detectTextLanguage, getTextAttributes } from '../../src/utils/textLanguage'

describe('detectTextLanguage', () => {
  it.each([
    ['English', 'und-Latn'],
    ['Русский', 'und-Cyrl'],
    ['Ελληνικά', 'und-Grek'],
    ['සිංහල', 'si'],
    ['नमस्ते', 'und-Deva'],
    ['مرحبا', 'und-Arab'],
    ['汉语', 'zh-Hans'],
    ['日本語です', 'ja'],
    ['한국어', 'ko'],
  ])('detects %s as %s', (text, expected) => {
    expect(detectTextLanguage(text)).toBe(expected)
  })

  it('uses Japanese when a string mixes kana and Han characters', () => {
    expect(detectTextLanguage('日本の言語')).toBe('ja')
  })

  it('uses Korean when a string mixes Hangul and Han characters', () => {
    expect(detectTextLanguage('한국어와 漢字')).toBe('ko')
  })

  it('defaults empty and punctuation-only content to the Latin stack', () => {
    expect(detectTextLanguage('')).toBe('und-Latn')
    expect(detectTextLanguage('123!?')).toBe('und-Latn')
  })

  it('allows the browser to determine text direction', () => {
    expect(getTextAttributes('مرحبا')).toEqual({ lang: 'und-Arab', dir: 'auto' })
  })
})
