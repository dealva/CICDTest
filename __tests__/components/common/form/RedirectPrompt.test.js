import { render, screen } from '@testing-library/react';
import RedirectPrompt from '@/components/common/form/RedirectPrompt';
import '@testing-library/jest-dom';

describe('RedirectPrompt', () => {
  it('renders message and link correctly', () => {
    render(
      <RedirectPrompt
        message="Already have an account?"
        linkText="Login here"
        href="/login"
      />
    );

    expect(screen.getByText('Already have an account?')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: 'Login here' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});
