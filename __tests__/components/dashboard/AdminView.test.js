import { render, screen, fireEvent } from '@testing-library/react';
import AdminView from '@/components/dashboard/AdminView';


const mockRedirect = jest.fn();
jest.mock('next/navigation', () => ({
  redirect: (...args) => mockRedirect(...args),
}));

// Mock child components that are already tested separately
jest.mock('@/components/dashboard/shared/UserView', () => (props) => (
  <div data-testid="user-view">{props.user.name}</div>
));
jest.mock('@/components/dashboard/shared/UserTable', () => (props) => (
  <div data-testid="user-table">{props.users.length} users</div>
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

// Mock useUsers hook
jest.mock('@/hooks/dashboard/useUsers', () => ({
  useUsers: () => ({
    searchTerm: '',
    handleChange: jest.fn(),
    paginatedUsers: [{ id: 1, name: 'User One' }],
    handleDelete: jest.fn(),
    currentPage: 1,
    totalPages: 1,
    handlePageChange: jest.fn(),
    itemsPerPage: 10,
    handleItemsPerPageChange: jest.fn(),
  }),
}));

describe('AdminView', () => {
  const admin = { name: 'Admin', role: 'admin' };
  const users = [{ id: 1, name: 'User One' }];
  const adminProfile = { name: 'Admin User', photo: '', role: 'admin' };

  it('renders all key components correctly', () => {
    render(<AdminView users={users} admin={admin} adminProfile={adminProfile} />);

    expect(screen.getByTestId('user-view')).toHaveTextContent('Admin User');
    expect(screen.getByTestId('dashboard-header')).toHaveTextContent('Admin Dashboard');
    expect(screen.getByRole('link', { name: /Add New User/i })).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('user-table')).toHaveTextContent('1 users');
    expect(screen.getByRole('button', { name: /Chat Room Admin/i })).toBeInTheDocument();
  });

  it('calls redirect when Chat Room Admin button is clicked', () => {
    render(<AdminView users={users} admin={admin} adminProfile={adminProfile} />);
    fireEvent.click(screen.getByRole('button', { name: /Chat Room Admin/i }));

    expect(mockRedirect).toHaveBeenCalledWith('/rooms/1');
  });
});
