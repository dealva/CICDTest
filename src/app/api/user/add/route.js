import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/auth';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { registerValidator } from '@/lib/validators';
import { StatusCodes } from 'http-status-codes';

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'admin') {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), {
      status: StatusCodes.UNAUTHORIZED,
    });
  }

  const body = await req.json();

  try {
    await registerValidator.validate(body, { abortEarly: false });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.errors.join(', ') }), {
      status: StatusCodes.BAD_REQUEST,
    });
  }

  const { name, email, password, major = '', bio = '', address = '', role } = body;
  console.log("Checking : ",email)
  try {
    // Check if email already exists
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return new Response(JSON.stringify({ message: 'Email already registered' }), {
        status: StatusCodes.CONFLICT,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into users table
    const [userResult] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const userId = userResult.insertId;

    // Insert into students table
    await db.execute(
      'INSERT INTO users_details (user_id, major, bio, address) VALUES (?, ?, ?, ?)',
      [userId, major, bio, address]
    );

    return new Response(JSON.stringify({ message: 'User created successfully' }), {
      status: StatusCodes.CREATED,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
}
