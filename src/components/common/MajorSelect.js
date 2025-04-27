'use client';

export default function MajorSelect({ value, onChange, name = 'major' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Major</label>
      <select
        name={name}
        value={value || ""} 
        onChange={onChange}
        className="w-full px-4 py-2 mt-1 border rounded-md"
      >
        <option value="">Select a major</option>
        <option value="Mathematics">Mathematics</option>
        <option value="Physics">Physics</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Biology">Biology</option>
        <option value="Engineering">Engineering</option>
      </select>
    </div>
  );
}
