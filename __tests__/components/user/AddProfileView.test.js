import { render, screen, fireEvent } from '@testing-library/react';
import AddProfileView from '@/components/user/AddProfileView';
import useAddProfileForm from '@/hooks/user/useAddProfileForm';

jest.mock('@/hooks/user/useAddProfileForm');

const mockHandleInputChange = jest.fn();
const mockHandleSubmit = jest.fn();

beforeEach(() => {
  useAddProfileForm.mockReturnValue({
    formData: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
      major: '',
      bio: '',
      address: '',
    },
    loading: false,
    handleInputChange: mockHandleInputChange,
    handleSubmit: mockHandleSubmit,
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('AddProfileView', () => {
  test('renders all form fields', () => {
    render(<AddProfileView />);

    expect(screen.getByRole('textbox', { name: /Name/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /Email/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password *')).toBeInTheDocument();
    expect(screen.getByLabelText(/Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
  });

  test('calls handleInputChange when input changes', () => {
    render(<AddProfileView />);

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });

    expect(mockHandleInputChange).toHaveBeenCalledWith(expect.any(Object));
  });

  test('calls handleSubmit when form is submitted', () => {
    render(<AddProfileView />);

    const form = screen.getByRole('form'); // OR use: container.querySelector('form')
    fireEvent.submit(form);

    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  test('submit button is disabled and shows loading when loading=true', () => {
    useAddProfileForm.mockReturnValue({
      formData: {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
        major: '',
        bio: '',
        address: '',
      },
      loading: true,
      handleInputChange: mockHandleInputChange,
      handleSubmit: mockHandleSubmit,
    });

    render(<AddProfileView />);
    const button = screen.getByRole('button', { name: /Add User/i });

    expect(button).toBeDisabled();
  });
});
