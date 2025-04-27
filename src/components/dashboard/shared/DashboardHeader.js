import LogoutButton from "@/components/common/LogoutButton";

export default function DashboardHeader({ title }) {
    return (
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        <LogoutButton />
      </div>
    );
  }
  