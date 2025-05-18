import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from '@/components/common/form/TextInput';

describe('TextInput', () => {
  it('renders a visible input with label', () => {
    render(
      <TextInput
        label="Email"
        type="email"
        name="email"
        value="test@example.com"
        onChange={() => {}}
      />
    );

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText('Email')).toHaveValue('test@example.com');
  });

  it('renders a hidden input without label', () => {
    render(
      <TextInput
        type="hidden"
        name="token"
        value="secret"
        onChange={() => {}}
      />
    );

    const input = screen.getByDisplayValue('secret');
    expect(input).toHaveAttribute('type', 'hidden');
    expect(screen.queryByLabelText(/./)).not.toBeInTheDocument(); // No visible label
  });

  it('calls onChange handler when input changes', () => {
    const handleChange = jest.fn();
    render(
      <TextInput
        label="Name"
        name="name"
        value=""
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Name');
    fireEvent.change(input, { target: { value: 'Alice' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('respects the required prop', () => {
    render(
      <TextInput
        label="Username"
        name="username"
        value=""
        onChange={() => {}}
        required
      />
    );

    const input = screen.getByLabelText('Username');
    expect(input).toBeRequired();
  });
});
