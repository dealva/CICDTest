'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react'; // Assuming you're using NextAuth for authentication
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation'; // For redirection
const LogoutButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleLogout = async () => {
    console.log('LogoutButton rendered'); // Debugging line
    setIsLoading(true);
    try {
      await signOut({ redirect: false }); // Ensure it does not redirect immediately
      toast.success('Successfully logged out!');  
      // console.log('Current path:', router.pathname);
      // if (router.pathname !== '/login') {
      //   router.push('/login');  
      // }
      
      window.location.href = "/login";
    } catch (error) {
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
