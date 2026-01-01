import { render, screen } from '@testing-library/react';
import TodoPage from '../pages/TodoPage'; // Import TodoPage component

test('renders Todo component on the TodoPage', () => {
  render(<TodoPage />);
  const addButton = screen.getByText(/Add Todo/i); // Check if the "Add Todo" button exists
  expect(addButton).toBeInTheDocument();
});
