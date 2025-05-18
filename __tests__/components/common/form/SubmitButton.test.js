import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SubmitButton from '@/components/common/form/SubmitButton';

describe('SubmitButton', () => {
  it('renders with normal text when not loading', () => {
    render(<SubmitButton text="Register" loading={false} />);
    const button = screen.getByRole('button', { name: 'Register' });

    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Register');
    expect(button).toBeEnabled();
  });

  it('renders with loading text and disabled state when loading', () => {
    render(<SubmitButton text="Register" loading={true} />);
    const button = screen.getByRole('button', { name: 'Register in process...' });

    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();
  });
});
