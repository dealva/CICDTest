'use client';

import { useState } from 'react';
import { redirect } from 'next/navigation';
import { toast } from 'react-toastify';
import { isRedirectError } from 'next/dist/client/components/redirect-error';

export default function useAddProfileForm() {


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    major: '',
    bio: '',
    address: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/user/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('User added successfully!');
        redirect('/dashboard');
      } else {
        toast.error(data.message || 'Failed to add user');
      }
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    try {
      redirect('/dashboard');
    } catch (err) {
      throw err; // Rethrow the error to be handled by Next.js
    }
  };

  return {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
    handleCancel,
  };
}
