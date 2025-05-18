
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import axios from 'axios';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
export default function useEditProfileForm () {
  const { data: session, status } = useSession();

  const [formData, setFormData] = useState({
    major: '',
    bio: '',
    address: '',
    photo: null,
  });
  const [loading, setLoading] = useState(false);
  
  let role=null
  // Fetch current user data when session is ready
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      try {
        return redirect('/login');
      } catch (err) { 
        throw err; // Rethrow the error to be handled by Next.js
      }
      
    }
   
    role=session.user.role
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user/data/${session.user.email}`);
        setFormData({
          major: response.data.major || '',
          bio: response.data.bio || '',
          address: response.data.address || '',
          photo: null,
        });
      } catch (error) {
        console.error('Error fetching user data:', error.response ? error.response.data : error.message);
      }
    };

    fetchUserData();
  }, [session, status]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleCancel = () => {
    try {
      redirect('/dashboard');
    }
    catch (err) { 
      throw err; // Rethrow the error to be handled by Next.js
    }
    
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!session) return;

    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append('major', formData.major);
    formDataToSend.append('bio', formData.bio);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('email', session.user.email);
    if (formData.photo) {
      formDataToSend.append('photo', formData.photo);
    }

    try {
      await axios.put(`/api/user/update/${session.user.email}`, formDataToSend);
      redirect('/dashboard');
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      console.error('Error updating profile:', error.response ? error.response.data : error.message);
      alert('Failed to update profile, please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    handleCancel,
    loading,
  };
};


