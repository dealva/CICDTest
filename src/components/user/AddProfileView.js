'use client';

import FormHeader from '../common/form/FormHeader';
import BackToDashboardButton from '../common/BackToDashboardButton';
import TextInput from '../common/form/TextInput';
import MajorSelect from '../common/MajorSelect';
import TextareaInput from '../common/form/TextareaInput';
import SubmitButton from '../common/form/SubmitButton';

import useAddProfileForm from '@/hooks/user/useAddProfileForm';

export default function AddProfileView() {
  const {
    formData,
    loading,
    handleInputChange,
    handleSubmit,
  } = useAddProfileForm();

  const { name, email, password, confirmPassword, role, major, bio, address } = formData;

  return (
    <>
      <div className="flex justify-between w-full">
        <FormHeader title="Add New Student" />
        <BackToDashboardButton />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-4 bg-white p-5 rounded-md" aria-label="Add user form">
        <TextInput label="Name *" name="name" value={name} onChange={handleInputChange} required />
        <TextInput label="Email *" type="email" name="email" value={email} onChange={handleInputChange} required />
        <TextInput label="Password *" type="password" name="password" value={password} onChange={handleInputChange} required />
        <TextInput label="Confirm Password *" type="password" name="confirmPassword" value={confirmPassword} onChange={handleInputChange} required />

        <div>
          <label htmlFor="role" className="block text-gray-700">Role *</label>
          <select
            id="role"
            name="role"
            value={role}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          >
            <option value="student">Student</option>
            <option value="lecturer">Lecturer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <MajorSelect name="major" value={major} onChange={handleInputChange} />

        <TextareaInput label="Bio (optional)" name="bio" value={bio} onChange={handleInputChange} />
        <TextareaInput label="Address (optional)" name="address" value={address} onChange={handleInputChange} />

        <SubmitButton text="Add User" loading={loading} />
      </form>
    </>
  );
}
