/**
 * Markdown Flashcard Parser
 *
 * Parses a plain-text/markdown file into an array of card candidates
 * using a simple Q:/A:/Hint:/Note: syntax.
 *
 * Syntax rules:
 * - Each card starts with "Q:" (question) followed by "A:" (answer)
 * - Optional fields: "Hint:" and "Note:" — must come after A:
 * - Blank lines separate cards
 * - Lines not starting with a known prefix are silently ignored
 * - A: appearing before Q: is flagged as an error
 *
 * Example:
 * ```
 * Q: What is 2 + 2?
 * A: 4
 * Hint: Think of pairs
 *
 * Q: Capital of France?
 * A: Paris
 * ```
 */

/**
 * Represents a single card parsed from a markdown import file.
 * Invalid cards carry one or more human-readable error messages.
 */
export interface ParsedCard {
  question: string
  answer: string
  hint: string | null
  note: string | null
  /** Human-readable parsing errors (empty array means valid) */
  errors: string[]
}

/**
 * Parses raw markdown text into an array of ParsedCard objects.
 *
 * @param text - Raw file content as a string
 * @returns Array of parsed cards. Cards with missing Q/A have
 *          placeholder values and their errors field populated.
 */
export function parseMarkdown(text: string): ParsedCard[] {
  const lines = text.split('\n')
  const cards: ParsedCard[] = []

  // Accumulator for the current card being built
  let current: Partial<ParsedCard> & { errors: string[] } = { errors: [] }
  let inCard = false

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()

    // Blank line = end of current card
    if (trimmed === '') {
      if (inCard) {
        finalizeCard(current, cards, i)
        current = { errors: [] }
        inCard = false
      }
      continue
    }

    // Question line — starts a new card (or finalizes previous if one is in progress)
    if (trimmed.startsWith('Q:')) {
      if (inCard) {
        // Flush previous card that was missing a blank-line separator
        finalizeCard(current, cards, i)
        current = { errors: [] }
      }
      inCard = true
      current.question = trimmed.substring(2).trim()
    }
    // Answer line
    else if (trimmed.startsWith('A:')) {
      if (!inCard) {
        // A: without a preceding Q: — flag it and skip
        current.errors.push(`Line ${i + 1}: A: without preceding Q:`)
        continue
      }
      current.answer = trimmed.substring(2).trim()
    }
    // Optional hint — only captured once and only after A: is set
    else if (trimmed.startsWith('Hint:')) {
      if (!current.hint && current.answer) {
        current.hint = trimmed.substring(5).trim()
      }
    }
    // Optional note — only captured once and only after A: is set
    else if (trimmed.startsWith('Note:')) {
      if (!current.note && current.answer) {
        current.note = trimmed.substring(5).trim()
      }
    }
    // Any other line is ignored (whitespace, comments, etc.)
  }

  // Flush the last card if the file didn't end with a blank line
  if (inCard) {
    finalizeCard(current, cards, lines.length)
  }

  return cards
}

/**
 * Validates and pushes the current accumulator as a finished ParsedCard.
 * If question or answer is missing, fills placeholders and records an error.
 */
function finalizeCard(
  current: Partial<ParsedCard> & { errors: string[] },
  cards: ParsedCard[],
  line: number
): void {
  if (!current.question || !current.answer) {
    current.errors.push(`Missing Q or A at line ~${line + 1}`)
    current.question = current.question || '(missing)'
    current.answer = current.answer || '(missing)'
  }
  cards.push(current as ParsedCard)
}
