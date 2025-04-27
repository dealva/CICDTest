import { useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { canUseAction } from '@/utils/rbac';
import { useSession } from 'next-auth/react'; 

export function useUsers(initialUsers, currentUser, initialItemsPerPage = 10) {

  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage); // Dynamic items per page state

  const handleDelete = async (id) => {
    // Check if the user has permission to delete the user
    const hasPermission = canUseAction(currentUser.role, 'delete', 'any');  // Assuming `currentUser` contains the logged-in user's info


    if (!hasPermission) {
      alert('You do not have permission to delete this user.');
      return;
    }
  
    const confirmDelete = window.confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
  
    try {
      await axios.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  };

  const handleChange = useCallback((e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search term changes
  }, []);

  const filteredUsers = useMemo(() => {
    const search = searchTerm.toLowerCase();

    return users.filter((user) => {
      const name = user.name?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const major = user.major?.toLowerCase() || '';
      const role = user.role?.toLowerCase() || '';
      const address = user.address?.toLowerCase() || '';

      return (
        name.includes(search) ||
        email.includes(search) ||
        major.includes(search) ||
        role.includes(search) ||
        address.includes(search)
      );
    });
  }, [users, searchTerm]);

  // Paginate the filtered users based on current page and itemsPerPage
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle change in items per page
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value)); // Change items per page
    setCurrentPage(1); // Reset to page 1 when items per page changes
  };

  return {
    users,
    setUsers,
    searchTerm,
    handleChange,
    handleDelete,
    filteredUsers,
    paginatedUsers,
    currentPage,
    handlePageChange,
    totalPages: Math.ceil(filteredUsers.length / itemsPerPage),
    itemsPerPage,
    handleItemsPerPageChange, // Expose the function to change items per page
  };
}
