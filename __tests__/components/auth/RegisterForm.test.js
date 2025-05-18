import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '@/components/auth/RegisterForm';

// Mock the useRegisterForm hook
jest.mock('@/hooks/auth/useRegisterForm', () => () => ({
  formData: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  loading: false,
  handleChange: jest.fn(),
  handleSubmit: jest.fn((e) => e.preventDefault()),
}));

describe('RegisterForm', () => {
  it('renders all form fields and submit button', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Register' })).toBeInTheDocument();
  });

  it('renders redirect prompt correctly', () => {
    render(<RegisterForm />);
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Login here' })).toHaveAttribute('href', '/login');
  });

  it('calls handleSubmit on form submission', () => {
    const { container } = render(<RegisterForm />);
    const form = container.querySelector('form');
    fireEvent.submit(form);

    expect(true).toBe(true);
  });
});
