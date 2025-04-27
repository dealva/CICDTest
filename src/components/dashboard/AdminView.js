'use client';

import Link from 'next/link';
import DashboardHeader from './shared/DashboardHeader';
import SearchBar from './shared/SearchBar';
import UserTable from './shared/UserTable';
import { useUsers } from '@/hooks/dashboard/useUsers'; 
import UserView from './shared/UserView';

export default function AdminView({ users, admin , adminProfile }) {
  const { searchTerm, handleChange, paginatedUsers, handleDelete, currentPage, totalPages, handlePageChange, itemsPerPage, handleItemsPerPageChange } = useUsers(users, admin);

  return (
    <div className="flex p-6 space-x-6">
      {/* Left side: User View */}
      <div className="w-1/4 flex-shrink-0">
        <UserView user={adminProfile} role={admin.role} />
      </div>

      {/* Right side: Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <DashboardHeader title={`${admin.name} Dashboard`} />

        <Link href="/users/add" className="text-blue-600 underline mb-4 inline-block">
          Add New User
        </Link>

        <SearchBar searchTerm={searchTerm} handleChange={handleChange} />

        <UserTable
          users={paginatedUsers}
          handleDelete={handleDelete}  
          isEditable
          isDeletable
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
