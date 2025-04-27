import { db } from '@/lib/db';

export async function GET(req, { params }) {
    const data=await params
    const email = data.email;
    // console.log("nilai email ", email)
    try {
      const [rows] = await db.execute(
        `SELECT s.major, s.bio, s.address
         FROM users_details s
         JOIN users u ON s.user_id = u.id
         WHERE u.email = ?`,
        [email]
      );
    //   console.log(rows.length)
      if (rows.length === 0) {
        return Response.json({ error: 'User not found' }, { status: 404 });
      }
  
      return Response.json(rows[0], { status: 200 });
    } catch (error) {
      console.error('Database error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  }
  