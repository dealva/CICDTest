'use client';

import { redirect } from "next/navigation";

const BackToDashboardButton = () => {
  // const router = useRouter();

  const handleClick = () => {
    try{
      redirect("/dashboard");
    } catch (error) {
      throw error; 
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
    >
      Back To Dashboard
    </button>
  );
};

export default BackToDashboardButton;
