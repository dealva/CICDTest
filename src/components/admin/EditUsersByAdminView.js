'use client';

import useEditUserForm from '@/hooks/admin/useEditUserForm';
import MajorSelect from '../common/MajorSelect';
import FormHeader from '../common/form/FormHeader';
import TextInput from '../common/form/TextInput';
import TextareaInput from '../common/form/TextareaInput';
import SubmitButton from '../common/form/SubmitButton';
import BackToDashboardButton from '../common/BackToDashboardButton';
export default function EditUserByAdmin({ user }) {
    const { formData, handleChange, handleSubmit } = useEditUserForm(user, 'admin'); // true = isAdmin
  
    return (
      <div className="p-6 bg-white rounded-lg shadow-lg m-6 min-h-11/12">
        <div className="flex justify-between w-full">
            <FormHeader title="Edit User Profile as Admin" />
            <BackToDashboardButton />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <TextInput
            label="Name"
            name="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
  
          {/* Role (only for Admins) */}
          {true && ( // Replace this with actual role-based condition
            <div>
              <label className="block text-gray-700">Role</label>
              <select
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
                <option value="lecturer">Lecturer</option>
              </select>
            </div>
          )}
  
          {/* Major */}
          <MajorSelect
            value={formData.major}
            onChange={(e) => handleChange('major', e.target.value)}
          />
  
          {/* Bio */}
          <TextareaInput
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
          />
  
          {/* Address */}
          <TextareaInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
  
          {/* Profile Photo */}
          <div>
            <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              id="profilePhoto"
              name="profilePhoto"
              onChange={(e) => handleChange('profilePhoto', e.target.files[0])}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
  
          {/* Submit Button */}
          <SubmitButton text="Update Profile" loading={false} />
        </form>
      </div>
    );
  }
