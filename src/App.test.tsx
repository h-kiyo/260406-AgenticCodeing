import App from '@/App';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('App', () => {
  it('renders the heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', {
      name: /React \+ Vite \+ TypeScript/i,
    });
    expect(heading).toBeInTheDocument();
  });

  it('increments count when button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const button = screen.getByRole('button', { name: /count is 0/i });

    await user.click(button);

    expect(button).toHaveTextContent('count is 1');
  });
});
