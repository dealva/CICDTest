'use client';

import EditProfileView from '@/components/user/EditProfileView';
import useEditProfileForm from '@/hooks/user/useEditProfileForm';

export default function EditProfile() {
  const {
    formData,
    handleInputChange,
    handleFileChange,
    handleSubmit,
    handleCancel,
    loading,
  } = useEditProfileForm();

  return (
    <EditProfileView
      formData={formData}
      handleInputChange={handleInputChange}
      handleFileChange={handleFileChange}
      handleSubmit={handleSubmit}
      handleCancel={handleCancel}
      loading={loading}
    />
  );
}