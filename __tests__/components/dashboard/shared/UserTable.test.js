import { render, screen, fireEvent } from '@testing-library/react';
import UserTable from '@/components/dashboard/shared/UserTable';
import '@testing-library/jest-dom';

const usersMock = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    major: 'Computer Science',
    role: 'student',
    address: '123 Street',
  },
];

describe('UserTable', () => {
  const handleDelete = jest.fn();
  const handlePageChange = jest.fn();
  const handleItemsPerPageChange = jest.fn();

  it('renders user data correctly', () => {
    render(
      <UserTable
        users={usersMock}
        handleDelete={handleDelete}
        isEditable={true}
        isDeletable={true}
        currentPage={1}
        totalPages={1}
        handlePageChange={handlePageChange}
        itemsPerPage={10}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Computer Science')).toBeInTheDocument();
    expect(screen.getByText('student')).toBeInTheDocument();
    expect(screen.getByText('123 Street')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('shows "No users found" when users array is empty', () => {
    render(
      <UserTable
        users={[]}
        handleDelete={handleDelete}
        isEditable={false}
        isDeletable={false}
        currentPage={1}
        totalPages={1}
        handlePageChange={handlePageChange}
        itemsPerPage={10}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
    );

    expect(screen.getByText('No users found.')).toBeInTheDocument();
  });

  it('calls handleDelete when delete button is clicked', () => {
    render(
      <UserTable
        users={usersMock}
        handleDelete={handleDelete}
        isEditable={true}
        isDeletable={true}
        currentPage={1}
        totalPages={1}
        handlePageChange={handlePageChange}
        itemsPerPage={10}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
    );

    fireEvent.click(screen.getByText('Delete'));
    expect(handleDelete).toHaveBeenCalledWith('1');
  });

  it('calls handlePageChange on pagination button click', () => {
    render(
      <UserTable
        users={usersMock}
        handleDelete={handleDelete}
        isEditable={false}
        isDeletable={false}
        currentPage={2}
        totalPages={3}
        handlePageChange={handlePageChange}
        itemsPerPage={10}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
    );

    fireEvent.click(screen.getByText('Previous'));
    expect(handlePageChange).toHaveBeenCalledWith(1);

    fireEvent.click(screen.getByText('Next'));
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('calls handleItemsPerPageChange on dropdown change', () => {
    render(
      <UserTable
        users={usersMock}
        handleDelete={handleDelete}
        isEditable={false}
        isDeletable={false}
        currentPage={1}
        totalPages={1}
        handlePageChange={handlePageChange}
        itemsPerPage={10}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />
    );

    fireEvent.change(screen.getByDisplayValue('10'), { target: { value: '20' } });
    expect(handleItemsPerPageChange).toHaveBeenCalled();
  });
});
