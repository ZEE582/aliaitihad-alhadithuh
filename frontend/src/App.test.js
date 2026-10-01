import { render, screen } from '@testing-library/react';
import App from './App';

test('renders kindergarten login screen', () => {
  render(<App />);

  expect(screen.getByText(/روضة الاتحاد الحديثة/i)).toBeInTheDocument();
  expect(screen.getByText(/نظام إدارة الروضة/i)).toBeInTheDocument();
});
