import { render, screen, fireEvent } from '@testing-library/react';
import EditProfileView from '@/components/user/EditProfileView';
global.URL.createObjectURL = jest.fn(() => 'mock-url');
describe('EditProfileView', () => {
  const mockHandleInputChange = jest.fn();
  const mockHandleFileChange = jest.fn();
  const mockHandleSubmit = jest.fn();
  const mockHandleCancel = jest.fn();

  const defaultProps = {
    formData: {
      major: 'Computer Science',
      bio: 'This is a test bio.',
      address: '123 Test Ave',
      photo: new File(['(⌐□_□)'], 'photo.png', { type: 'image/png' }),
    },
    handleInputChange: mockHandleInputChange,
    handleFileChange: mockHandleFileChange,
    handleSubmit: mockHandleSubmit,
    handleCancel: mockHandleCancel,
    loading: false,
  };

  it('renders form fields and header', () => {
    render(<EditProfileView {...defaultProps} />);

    expect(screen.getByText(/Edit Your Profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bio/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Profile Photo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Save Changes/i })).toBeInTheDocument();
  });

  it('calls handleInputChange on input change', () => {
    render(<EditProfileView {...defaultProps} />);
    const bioInput = screen.getByLabelText(/Bio/i);
    fireEvent.change(bioInput, { target: { name: 'bio', value: 'New bio' } });
    expect(mockHandleInputChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls handleFileChange on file input change', () => {
    render(<EditProfileView {...defaultProps} />);
    const fileInput = screen.getByLabelText(/Profile Photo/i);
    const file = new File(['dummy'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(mockHandleFileChange).toHaveBeenCalledWith(expect.any(Object));
  });

  it('calls handleSubmit when form is submitted', () => {
    render(<EditProfileView {...defaultProps} />);
    const form = screen.getByRole('form', { hidden: true }) || screen.getByRole('button', { name: /Save Changes/i }).closest('form');
    fireEvent.submit(form);
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('displays image preview when photo is provided', () => {
    render(<EditProfileView {...defaultProps} />);
    expect(screen.getByAltText(/Profile Preview/i)).toBeInTheDocument();
  });
});
