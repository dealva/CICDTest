'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { canUseAction } from '@/utils/rbac';

export default function useEditUserForm(initialUser, role = 'student') {
  const [formData, setFormData] = useState(() => ({
    name: initialUser.name || '',
    major: initialUser.major || '',
    bio: initialUser.bio || '',
    address: initialUser.address || '',
    profilePhoto: null,
    role: initialUser.role || role, // Default role to 'student', can be overridden for admin/lecturer
  }));



  // Permissions Check for role-based actions
  const canUpdateOwn = canUseAction(role, 'update', 'own'); // Check if user can update their own profile
  const canUpdateAny = canUseAction(role, 'update', 'any'); // Admin check for updating any profile

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If the user is a lecturer, we ensure they can't modify the role
    if (role === 'lecturer') {
      delete formData.role; // Remove role field for lecturers
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('major', formData.major);
      form.append('bio', formData.bio);
      form.append('address', formData.address);
      if (formData.profilePhoto) {
        form.append('profilePhoto', formData.profilePhoto);
      }

      // For admins, we can send the role field
      if (role === 'admin') {
        form.append('role', formData.role);
      }

      const response = await fetch(`/api/users/${initialUser.id}`, {
        method: 'PUT',
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Profile updated successfully');
        redirect('/dashboard'); 
      } else {
        toast.error(data.message || 'Error updating profile');
      }
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }else{
        toast.error(error.message ||'Something went wrong!');
      }
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    canUpdateOwn,
    canUpdateAny,
  };
}

