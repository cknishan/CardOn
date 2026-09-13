export interface SampleCardTemplate {
  question: string
  answer: string
}

export interface SampleDeckTemplate {
  name: string
  description: string
  cards: readonly SampleCardTemplate[]
}

export const SAMPLE_DECKS: readonly SampleDeckTemplate[] = [
  {
    name: 'Math Essentials',
    description: 'A quick review of arithmetic, algebra, and geometry fundamentals.',
    cards: [
      { question: 'What is 7 × 8?', answer: '56' },
      { question: 'What is the square root of 144?', answer: '12' },
      { question: 'What is 15% of 200?', answer: '30' },
      { question: 'Solve: 3x + 5 = 20', answer: 'x = 5' },
      { question: 'What do the interior angles of a triangle add up to?', answer: '180°' },
      { question: 'What is the formula for the area of a circle?', answer: 'A = πr²' },
    ],
  },
  {
    name: 'World Geography',
    description: 'Test your knowledge of countries, continents, oceans, and landmarks.',
    cards: [
      { question: 'What is the capital of Japan?', answer: 'Tokyo' },
      { question: 'Which is the largest ocean on Earth?', answer: 'The Pacific Ocean' },
      { question: 'On which continent is the Sahara Desert?', answer: 'Africa' },
      { question: 'Into which sea does the Nile River flow?', answer: 'The Mediterranean Sea' },
      { question: 'What longitude is the Prime Meridian?', answer: '0° longitude' },
      { question: 'Which European country is often described as boot-shaped?', answer: 'Italy' },
    ],
  },
  {
    name: 'Science Basics',
    description: 'Explore introductory ideas from biology, chemistry, physics, and astronomy.',
    cards: [
      { question: 'What is the chemical symbol for oxygen?', answer: 'O' },
      { question: 'Which planet is known as the Red Planet?', answer: 'Mars' },
      { question: 'What is the SI unit of force?', answer: 'The newton (N)' },
      { question: 'What does DNA stand for?', answer: 'Deoxyribonucleic acid' },
      {
        question: 'What process do plants use to convert light into chemical energy?',
        answer: 'Photosynthesis',
      },
      {
        question: 'At what temperature does water boil at sea level?',
        answer: '100°C',
      },
    ],
  },
]
