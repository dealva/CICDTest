import { render, screen } from '@testing-library/react';
import UserView from '@/components/dashboard/shared/UserView';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';

jest.mock('next/link', () => {
  return ({ href, children }) => <a href={href}>{children}</a>;
});

const baseUser = {
  name: 'Alice Smith',
  email: 'alice@example.com',
  photo: 'https://example.com/photo.jpg',
  role: 'student',
  major: 'Biology',
  bio: 'I love biology.\nEspecially genetics.',
  address: '456 Science Ave',
};

describe('UserView', () => {
  it('renders user profile details for regular user', () => {
    render(<UserView user={baseUser} role="student" />);

    expect(screen.getByText('Your Biodata')).toBeInTheDocument();
    expect(screen.getByText(baseUser.name)).toBeInTheDocument();
    expect(screen.getByText(baseUser.email)).toBeInTheDocument();
    expect(screen.getByText(baseUser.role)).toBeInTheDocument();
    expect(screen.getByText('Major:')).toBeInTheDocument();
    expect(screen.getByText(baseUser.major)).toBeInTheDocument();
    expect(screen.getByText('Bio:')).toBeInTheDocument();
    expect(screen.getByText((content) => content.includes('I love biology.'))).toBeInTheDocument();
    expect(screen.getByText('Address:')).toBeInTheDocument();
    expect(screen.getByText(baseUser.address)).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', baseUser.photo);
  });

  it('renders fallback photo if user.photo is missing', () => {
    const userWithoutPhoto = { ...baseUser, photo: '' };
    render(<UserView user={userWithoutPhoto} role="student" />);
    expect(screen.getByText('No Photo')).toBeInTheDocument();
  });

  it('shows "User Profile" title for admin and hides major field', () => {
    render(<UserView user={baseUser} role="admin" />);
    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.queryByText('Major:')).not.toBeInTheDocument();
  });

  it('renders edit profile link', () => {
    render(<UserView user={baseUser} role="student" />);
    const editLink = screen.getByRole('link', { name: 'Edit Your Profile' });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute('href', '/users/edit');
  });
});
