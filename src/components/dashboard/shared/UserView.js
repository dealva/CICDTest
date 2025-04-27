import Link from 'next/link';

export default function UserView({ user, role }) {
  return (

      <div className="max-w-3xl mx-auto mt-2 fixed p-8 bg-white rounded-2xl shadow-lg space-y-6 border border-gray-200 min-h-11/12 ">
        <div className="flex justify-between items-center border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === 'admin' ? 'User Profile' : 'Your Biodata'}
          </h1>
        </div>

        <div className="flex items-center gap-6">
          {user.photo ? (
            <img
              src={user.photo}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover ring-2 ring-blue-500 shadow"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold border">
              No Photo
            </div>
          )}

          <div>
            <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
            <p className="text-sm text-blue-600 font-semibold mt-1">
              {user.role}
            </p>
          </div>
        </div>

        
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            {role !== 'admin' && (
                <div>
                <span className="font-medium">Major:</span>
                <div className="mt-1 text-gray-900">{user.major || '—'}</div>
                </div>
            )}
            <div>
              <span className="font-medium">Bio:</span>
              <div className="mt-1 text-gray-900 whitespace-pre-line">{user.bio || '—'}</div>
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Address:</span>
              <div className="mt-1 text-gray-900 whitespace-pre-line">{user.address || '—'}</div>
            </div>
          </div>
      

        <div className="pt-4 border-t">
          <Link
            href={`/users/edit`}
            className="inline-block text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition"
          >
            Edit Your Profile
          </Link>
        </div>
      </div>

  );
}
