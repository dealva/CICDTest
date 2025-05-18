'use client';

import Link from 'next/link';
import DashboardHeader from './shared/DashboardHeader';
import SearchBar from './shared/SearchBar';
import UserTable from './shared/UserTable';
import { useUsers } from '@/hooks/dashboard/useUsers'; 
import UserView from './shared/UserView';
import { redirect } from 'next/navigation';

export default function AdminView({ users, admin , adminProfile }) {
  const { searchTerm, handleChange, paginatedUsers, handleDelete, currentPage, totalPages, handlePageChange, itemsPerPage, handleItemsPerPageChange } = useUsers(users, admin);
  // Setting Socket event
 
  const  chatRoomAdmin  = () => {
    try { 
      redirect("/rooms/1");
    } catch (error) { 
      throw error; 
    }
    
  };

  
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
        <button
          onClick={chatRoomAdmin}
          className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white px-4 py-2 rounded w-full my-4 transition duration-150"
        >
          Chat Room Admin
        </button>
      </div>
    </div>
  );
}
