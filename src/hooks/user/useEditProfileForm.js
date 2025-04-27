
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function useEditProfileForm () {
  const { data: session, status } = useSession();
  const router = useRouter();
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
      router.push('/login');
      return;
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
  }, [session, status, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleCancel = () => {
    router.push('/dashboard');
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
      router.push('/dashboard');
    } catch (error) {
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


