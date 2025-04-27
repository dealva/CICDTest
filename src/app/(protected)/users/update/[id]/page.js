import EditUsersByAdminView from '@/components/admin/EditUsersByAdminView';
import EditUsersByLecturerView from '@/components/admin/EditUserByLecturerView';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import { db } from '@/lib/db';

export default async function Page({ params }) {
  const session = await getServerSession(authOptions);
  const data=await params
  const id = data.id;
  
  // Fetch student with photo
  const [rows] = await db.execute(
    'SELECT u.id, u.name, s.major, s.address, s.bio, s.photo, u.role FROM users_details s JOIN users u ON s.user_id = u.id WHERE s.user_id = ?',
    [id]
  );

  const student = rows[0];
  if (!student) {
    return <div className="p-4 text-red-500">Student not found</div>;
  }

  // Convert photo (Uint8Array) to base64 string for image rendering
  if (student.photo instanceof Uint8Array) {
    const base64Photo = Buffer.from(student.photo).toString('base64');
    student.photo = `data:image/jpeg;base64,${base64Photo}`; // assuming it's a JPEG, change if needed
  }

  // Render based on role
  if (session?.user?.role === 'admin') {
    return <EditUsersByAdminView user={student} />;
  }

  if (session?.user?.role === 'lecturer') {
    return <EditUsersByLecturerView user={student} />;
  }

  return <div className="p-4 text-red-500">Unauthorized</div>;
}
