// components/view/EditProfileView.js

import FormHeader from '@/components/common/form/FormHeader';
import TextareaInput from '@/components/common/form/TextareaInput';
import SubmitButton from '@/components/common/form/SubmitButton';
import MajorSelect from '@/components/common/MajorSelect';
import BackToDashboardButton from '../common/BackToDashboardButton';
export default function EditProfileView ({
  formData,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  handleCancel,
  loading,

}){
  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-400">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow space-y-6 w-full">

        {/* Header */}
        
        <div className="flex justify-between items-center w-full">
          <FormHeader title="Edit Your Profile" />
          <BackToDashboardButton />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <MajorSelect value={formData.major} onChange={handleInputChange} />
          

          <TextareaInput
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />

          <TextareaInput
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />

          {/* Profile Photo Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Profile Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-2 mt-1 border rounded-md"
            />
            {formData.photo && (
              <>
                <label className="block text-sm font-medium text-gray-700 mt-4">Profile Preview</label>
                <img
                  src={URL.createObjectURL(formData.photo)}
                  alt="Profile Preview"
                  className="w-32 h-32 object-cover rounded-full mt-2"
                />
              </>
            )}
          </div>

          <SubmitButton text="Save Changes" loading={loading} />
        </form>

      </div>
    </div>
  );
};


