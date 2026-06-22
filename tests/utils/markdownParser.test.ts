import { describe, it, expect } from 'vitest'
import { parseMarkdown } from '../../src/utils/markdownParser'

function parse(text: string) {
  return parseMarkdown(text)
}

describe('parseMarkdown', () => {
  it('parses a single card with Q and A', () => {
    const result = parse('Q: What is 2+2?\nA: 4')
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('What is 2+2?')
    expect(result[0].answer).toBe('4')
    expect(result[0].hint).toBeUndefined()
    expect(result[0].note).toBeUndefined()
    expect(result[0].errors).toEqual([])
  })

  it('parses multiple cards separated by blank lines', () => {
    const text = 'Q: Q1?\nA: A1\n\nQ: Q2?\nA: A2'
    const result = parse(text)
    expect(result).toHaveLength(2)
    expect(result[0].question).toBe('Q1?')
    expect(result[0].answer).toBe('A1')
    expect(result[1].question).toBe('Q2?')
    expect(result[1].answer).toBe('A2')
    expect(result[1].errors).toEqual([])
  })

  it('parses card with optional Hint', () => {
    const result = parse('Q: Q?\nA: A\nHint: Try harder')
    expect(result[0].hint).toBe('Try harder')
    expect(result[0].errors).toEqual([])
  })

  it('parses card with optional Note', () => {
    const result = parse('Q: Q?\nA: A\nNote: See chapter 3')
    expect(result[0].note).toBe('See chapter 3')
    expect(result[0].errors).toEqual([])
  })

  it('parses card with both Hint and Note', () => {
    const result = parse('Q: Q?\nA: A\nHint: H\nNote: N')
    expect(result[0].hint).toBe('H')
    expect(result[0].note).toBe('N')
    expect(result[0].errors).toEqual([])
  })

  it('trims whitespace from Q, A, Hint, and Note values', () => {
    const result = parse('Q:   What is this?   \nA:   answer   \nHint:   hint   \nNote:   note   ')
    expect(result[0].question).toBe('What is this?')
    expect(result[0].answer).toBe('answer')
    expect(result[0].hint).toBe('hint')
    expect(result[0].note).toBe('note')
  })

  it('fills missing answer with placeholder and records an error', () => {
    const result = parse('Q: Orphan question?')
    expect(result).toHaveLength(1)
    expect(result[0].answer).toBe('(missing)')
    expect(result[0].errors).toHaveLength(1)
    expect(result[0].errors[0]).toMatch(/missing/i)
  })

  it('fills missing question with placeholder and records an error', () => {
    const result = parse('Q:\nA: answer')
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('(missing)')
    expect(result[0].answer).toBe('answer')
    expect(result[0].errors).toHaveLength(1)
    expect(result[0].errors[0]).toMatch(/missing/i)
  })

  it('records an error for A: without preceding Q:', () => {
    const result = parse('A: stray\nQ: Real Q?\nA: Real A')
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('Real Q?')
    expect(result[0].answer).toBe('Real A')
    expect(result[0].errors).toHaveLength(1)
    expect(result[0].errors[0]).toMatch(/without preceding Q/i)
  })

  it('consecutive Q: lines start new cards, previous gets missing A', () => {
    const result = parse('Q: First?\nQ: Second?\nA: Second answer')
    expect(result).toHaveLength(2)
    expect(result[0].question).toBe('First?')
    expect(result[0].answer).toBe('(missing)')
    expect(result[0].errors).toHaveLength(1)
    expect(result[1].question).toBe('Second?')
    expect(result[1].answer).toBe('Second answer')
    expect(result[1].errors).toEqual([])
  })

  it('ignores lines that do not start with a known prefix', () => {
    const text = 'Some intro text\nQ: Q?\nA: A\n--separator--\nNote: N'
    const result = parse(text)
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('Q?')
    expect(result[0].note).toBe('N')
    expect(result[0].errors).toEqual([])
  })

  it('returns an empty array for empty input', () => {
    expect(parse('')).toEqual([])
  })

  it('returns an empty array for input with only blank lines', () => {
    expect(parse('\n\n\n')).toEqual([])
  })

  it('captures only the first Hint line', () => {
    const result = parse('Q: Q?\nA: A\nHint: First\nHint: Second')
    expect(result[0].hint).toBe('First')
  })

  it('captures only the first Note line', () => {
    const result = parse('Q: Q?\nA: A\nNote: First\nNote: Second')
    expect(result[0].note).toBe('First')
  })

  it('ignores Hint that appears before A: is set', () => {
    const result = parse('Q: Q?\nHint: Early\nA: A')
    expect(result[0].hint).toBeUndefined()
  })

  it('ignores Note that appears before A: is set', () => {
    const result = parse('Q: Q?\nNote: Early\nA: A')
    expect(result[0].note).toBeUndefined()
  })

  it('finalizes the last card when file does not end with a blank line', () => {
    const result = parse('Q: Q?\nA: A')
    expect(result).toHaveLength(1)
    expect(result[0].question).toBe('Q?')
  })

  it('handles multiple cards with optional fields throughout', () => {
    const text = [
      'Q: First?',
      'A: First answer',
      'Hint: First hint',
      '',
      'Q: Second?',
      'A: Second answer',
      'Note: Second note',
      '',
      'Q: Third?',
      'A: Third answer',
      'Hint: Third hint',
      'Note: Third note',
    ].join('\n')
    const result = parse(text)
    expect(result).toHaveLength(3)
    expect(result[0].hint).toBe('First hint')
    expect(result[0].note).toBeUndefined()
    expect(result[1].hint).toBeUndefined()
    expect(result[1].note).toBe('Second note')
    expect(result[2].hint).toBe('Third hint')
    expect(result[2].note).toBe('Third note')
  })

  it('produces cards with no errors for well-formed input', () => {
    const text = 'Q: Q1?\nA: A1\n\nQ: Q2?\nA: A2'
    const result = parse(text)
    expect(result.every((c) => c.errors.length === 0)).toBe(true)
  })
})
