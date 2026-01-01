
import { render, screen, fireEvent } from '@testing-library/react';
import Flashcards from '../pages/Flashcards';  // Assuming Flashcards is in pages

test('displays and interacts with flashcards correctly', () => {
  render(<Flashcards />);

  // Check if the first flashcard question is visible
  const question = screen.getByText(/What is the capital of France?/i);
  expect(question).toBeInTheDocument();

  // Simulate clicking the "Reveal Answer" button
  fireEvent.click(screen.getByText(/Reveal Answer/i));

  // Check if the answer is visible
  const answer = screen.getByText(/Paris/i); // Assuming the answer is "Paris"
  expect(answer).toBeInTheDocument();

  // Simulate clicking the "Next Card" button to go to the next flashcard
  fireEvent.click(screen.getByText(/Next Card/i));

  // Check if the next question is displayed
  const nextQuestion = screen.getByText(/What is the capital of Japan?/i);  // New flashcard question
  expect(nextQuestion).toBeInTheDocument();
});
