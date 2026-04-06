import App from '@/App';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

describe('App', () => {
  it('renders GameStart screen initially', () => {
    render(<App />);
    const title = screen.getByRole('heading', { name: /🗼 ハノイの塔/i });
    expect(title).toBeInTheDocument();
  });

  it('renders difficulty buttons on start screen', () => {
    render(<App />);
    const easyButton = screen.getByRole('button', { name: /かんたん/i });
    const normalButton = screen.getByRole('button', { name: /ふつう/i });
    const hardButton = screen.getByRole('button', { name: /むずかしい/i });

    expect(easyButton).toBeInTheDocument();
    expect(normalButton).toBeInTheDocument();
    expect(hardButton).toBeInTheDocument();
  });

  it('shows back button when game starts', async () => {
    const user = userEvent.setup();
    render(<App />);
    const easyButton = screen.getByRole('button', { name: /かんたん/i });

    await user.click(easyButton);

    const backButton = screen.getByRole('button', { name: /← 戻る/i });
    expect(backButton).toBeInTheDocument();
  });

  it('returns to GameStart when back button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);
    const easyButton = screen.getByRole('button', { name: /かんたん/i });

    await user.click(easyButton);

    const backButton = screen.getByRole('button', { name: /← 戻る/i });
    await user.click(backButton);

    const title = screen.getByRole('heading', { name: /🗼 ハノイの塔/i });
    expect(title).toBeInTheDocument();
  });
});
