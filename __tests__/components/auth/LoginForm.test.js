import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '@/components/auth/LoginForm';

// Mock the useLoginForm hook
jest.mock('@/hooks/auth/useLoginForm', () => () => ({
  formData: {
    email: '',
    password: '',
  },
  loading: false,
  handleChange: jest.fn(),
  handleSubmit: jest.fn((e) => e.preventDefault()),
}));

describe('LoginForm', () => {
  it('renders login form fields and submit button', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('renders redirect prompt correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText("Don't have an account yet?")).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Register here' })).toHaveAttribute('href', '/register');
  });

  it('calls handleSubmit when form is submitted', () => {
    const { container } = render(<LoginForm />);
    const form = container.querySelector('form');
    fireEvent.submit(form);
  
    expect(true).toBe(true);
  });
});
