import { render, screen } from '@testing-library/react';
import LecturerView from '@/components/dashboard/LecturerView';
// Mock components
jest.mock('@/components/dashboard/shared/UserView', () => (props) => (
  <div data-testid="user-view">{props.user.name}</div>
));
jest.mock('@/components/dashboard/shared/DashboardHeader', () => (props) => (
  <div data-testid="dashboard-header">{props.title}</div>
));
jest.mock('@/components/dashboard/shared/SearchBar', () => (props) => (
  <input
    data-testid="search-bar"
    value={props.searchTerm}
    onChange={props.handleChange}
  />
));
jest.mock('@/components/dashboard/shared/UserTable', () => (props) => (
  <div data-testid="user-table">{props.users.length} users</div>
));

// Mock hook
jest.mock('@/hooks/dashboard/useUsers', () => ({
  useUsers: () => ({
    searchTerm: '',
    handleChange: jest.fn(),
    paginatedUsers: [{ id: 1, name: 'Student A' }],
    handleDelete: jest.fn(),
    currentPage: 1,
    totalPages: 1,
    handlePageChange: jest.fn(),
    itemsPerPage: 10,
    handleItemsPerPageChange: jest.fn(),
  }),
}));

describe('LecturerView', () => {
  const user = { name: 'Lecturer Lisa', role: 'lecturer' };
  const users = [{ id: 1, name: 'Student A' }];
  const userProfile = { name: 'Lecturer Lisa', photo: '', role: 'lecturer' };

  it('renders lecturer dashboard with expected components', () => {
    render(<LecturerView users={users} user={user} userProfile={userProfile} />);

    expect(screen.getByTestId('user-view')).toHaveTextContent('Lecturer Lisa');
    expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Lecturer Lisa Dashboard');
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-table')).toHaveTextContent('1 users');
  });
});
