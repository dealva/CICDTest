export default function SearchBar({ searchTerm, handleChange }) {
  return (
    <div className="mb-4 ">
      <input
        type="text"
        placeholder="Search here"
        value={searchTerm}
        onChange={handleChange}
        className="w-full p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      />
    </div>
  );
}
