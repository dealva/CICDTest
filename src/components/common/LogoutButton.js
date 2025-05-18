'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react'; // Assuming you're using NextAuth for authentication
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation'; // For redirection
import { isRedirectError } from 'next/dist/client/components/redirect-error';
const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
 
  
  const handleLogout = async () => {
    console.log('LogoutButton rendered'); // Debugging line
    setIsLoading(true);
    try {
      await signOut({ redirect: false }); // Ensure it does not redirect immediately
      toast.success('Successfully logged out!');  
      
      
      redirect('/login'); // Redirect to login page after logout
    } catch (error) {
      if (isRedirectError(error)) {
        throw error; // Rethrow the error to be handled by Next.js
      }
      toast.error('Error logging out');
    } finally {
      setIsLoading(false);

    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
    >
      {isLoading ? 'Logging out...' : 'Logout'}
    </button>
  );
};

export default LogoutButton;
