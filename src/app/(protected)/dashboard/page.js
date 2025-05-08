import { getServerSession } from 'next-auth';
import { db } from '@/lib/db';
import { authOptions } from '@/app/auth';
import { redirect } from 'next/navigation';
import AdminView from '@/components/dashboard/AdminView';
import LecturerView from '@/components/dashboard/LecturerView';
import StudentView from '@/components/dashboard/StudentView';
import { metadataConfig } from '@/lib/metadata';


const fetchUserData = async () => {
  const [students] = await db.execute(`
    SELECT u.id, u.name, u.email, u.role, s.major, s.address
    FROM users_details s
    JOIN users u ON s.user_id = u.id
  `);
  return students;
};
  
const fetchStudentsByMajor = async (major) => {
  const [students] = await db.execute(`
    SELECT u.id, u.name, u.email, u.role, s.major, s.address
    FROM users_details s
    JOIN users u ON s.user_id = u.id
    WHERE s.major = ? AND u.role = 'student'
  `, [major]);

  return students;
};

const fetchUserProfile = async (email) => {
  const [rows] = await db.execute(`
    SELECT u.name, u.email, u.role, s.major, s.bio, s.address, s.photo
    FROM users u
    LEFT JOIN users_details s ON u.id = s.user_id
    WHERE u.email = ?
  `, [email]);
  if (rows[0] && rows[0].photo) {
    const base64Photo = Buffer.from(rows[0].photo).toString('base64');
    rows[0].photo = `data:image/jpeg;base64,${base64Photo}`; // You can adjust the MIME type if needed
  }
  return rows[0];
};

export const metadata = metadataConfig.dashboard;

export default async function DashboardPage() {
  // Get the session information
  const session = await getServerSession(authOptions);

  // If no session or user, redirect to login page
  if (!session || !session.user) {
    return redirect('/login');
  }

  // Determine user role and fetch the necessary data
  let view;
  const { role, email } = session.user;
  const userProfile = await fetchUserProfile(email);
  
  switch (role) {
    case 'admin':
      const users = await fetchUserData();
      view = <AdminView users={users} admin={session.user} adminProfile={userProfile} />;
      break;

    case 'lecturer':
      const lecturerStudents = await fetchStudentsByMajor(userProfile.major);
      view = <LecturerView users={lecturerStudents} user={session.user} userProfile={userProfile}  />;
      break;

    default: // Assuming 'student' role
      view = <StudentView user={session.user} userProfile={userProfile} />;
      break;
  }

  return view;
}
