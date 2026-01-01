import { render, screen, fireEvent } from '@testing-library/react';
import Pomodoro from '../pages/Pomodoro';  // Assuming Pomodoro is in pages

test('starts and stops the Pomodoro timer', () => {
  render(<Pomodoro />);

  // Simulate clicking the start button
  fireEvent.click(screen.getByText(/Start/i));

  // Check if the timer starts (for simplicity, we assume a text or countdown appears)
  expect(screen.getByText(/Pomodoro Timer/i)).toBeInTheDocument(); // Check if the timer text is visible

  // Simulate clicking the stop button
  fireEvent.click(screen.getByText(/Stop/i));

  // Check if the timer stops (maybe check if the button text changes or timer stops)
  expect(screen.getByText(/Start/i)).toBeInTheDocument(); // Check if the Start button reappears (indicating stop)
});
