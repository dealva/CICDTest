import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import { redirect } from 'next/navigation';
import AddProfileView from '@/components/user/AddProfileView';

export default async function AddStudentPage() {
  const session = await getServerSession(authOptions);

  // If not logged in, redirect to login
  if (!session) {
    redirect('/login');
  }

  // If not admin, redirect to dashboard (or show error)
  if (session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="p-6">
      <AddProfileView />
    </div>
  );
}
