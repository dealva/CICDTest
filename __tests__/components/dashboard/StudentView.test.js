import { render, screen } from '@testing-library/react';
import StudentView from '@/components/dashboard/StudentView';

// Mock components
jest.mock('@/components/dashboard/shared/UserView', () => (props) => (
  <div data-testid="user-view">{props.user.name}</div>
));
jest.mock('@/components/dashboard/shared/DashboardHeader', () => (props) => (
  <div data-testid="dashboard-header">{props.title}</div>
));

describe('StudentView', () => {
  const user = { name: 'Student Steve', role: 'student' };
  const userProfile = { name: 'Student Steve', role: 'student', photo: '', major: '', bio: '', address: '' };

  it('renders student dashboard with welcome message', () => {
    render(<StudentView user={user} userProfile={userProfile} />);

    expect(screen.getByTestId('user-view')).toHaveTextContent('Student Steve');
    expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Student Steve Dashboard');
    expect(screen.getByText(/Selamat datang Mahasiswa Baru/i)).toBeInTheDocument();
  });
});
