import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LogoutButton from "@/components/common/LogoutButton";
import { signOut } from 'next-auth/react';

// Mock signOut
jest.mock('next-auth/react', () => ({
  signOut: jest.fn(),
}));

// Mock redirect from next/navigation
const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args) => mockRedirect(...args),
}));

describe('LogoutButton', () => {
  it('should render correctly', () => {
    render(<LogoutButton />);
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('should call signOut and redirect when clicked', async () => {
    signOut.mockResolvedValue({});

    render(<LogoutButton />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(signOut).toHaveBeenCalledWith({ redirect: false });
      expect(mockRedirect).toHaveBeenCalledWith('/login');
    });
  });
});
