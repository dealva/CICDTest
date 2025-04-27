'use client';

import DashboardHeader from './shared/DashboardHeader';
import SearchBar from './shared/SearchBar';
import UserTable from './shared/UserTable';
import { useUsers } from '@/hooks/dashboard/useUsers'; 
import UserView from './shared/UserView';

export default function LecturerView({ users, user , userProfile }) {
  const { searchTerm, handleChange, paginatedUsers, handleDelete, currentPage, totalPages, handlePageChange, itemsPerPage, handleItemsPerPageChange } = useUsers(users, user);

  return (
    <div className="flex p-6 space-x-6">
      <div className="w-1/4 flex-shrink-0">
        <UserView user={userProfile} role={user.role} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title={`${user.name} Dashboard`} />

        <SearchBar searchTerm={searchTerm} handleChange={handleChange} />

        <UserTable
          users={paginatedUsers}
          handleDelete={handleDelete}  
          isEditable
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          handleItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>

    </div>
  );
}
