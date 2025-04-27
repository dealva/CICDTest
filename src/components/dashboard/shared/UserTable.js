import Link from 'next/link';

export default function UserTable({ users, handleDelete, isEditable , isDeletable = false, currentPage, totalPages, handlePageChange, itemsPerPage, handleItemsPerPageChange }) {
  return (
    <div className="overflow-x-auto bg-white p-5 rounded-md">
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b text-left">Name</th>
            <th className="px-4 py-2 border-b text-left">Email</th>
            <th className="px-4 py-2 border-b text-left">Major</th>
            <th className="px-4 py-2 border-b text-left">Role</th>
            <th className="px-4 py-2 border-b text-left">Address</th>
            {isEditable && <th className="px-4 py-2 border-b text-left">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2 border-b">{user.name}</td>
                <td className="px-4 py-2 border-b">{user.email}</td>
                <td className="px-4 py-2 border-b">{user.major}</td>
                <td className="px-4 py-2 border-b">{user.role}</td>
                <td className="px-4 py-2 border-b">{user.address || '-'}</td>
                {isEditable && (
                  <td className="px-4 py-2 border-b">
                    <Link href={`/users/update/${user.id}`} className="text-blue-500 hover:underline mr-4">
                      Edit
                    </Link>
                    {isDeletable && (
                      <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                    
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isEditable ? 6 : 5} className="px-4 py-2 border-b text-center">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4 items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 text-black disabled:bg-gray-500"
          >
            Previous
          </button>
          <div className="flex items-center justify-center">
            Page {currentPage} of {totalPages}
          </div>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-300 text-black disabled:bg-gray-500"
          >
            Next
          </button>
        </div>


        {/* Items per page selection */}
        <div className="flex items-center space-x-2">
          <span>Show:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
          </select>
          <span>per page</span>
        </div>
      </div>
    </div>
  );
}
