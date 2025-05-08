import { NextResponse } from 'next/server';
import { registerValidator } from '@/lib/validators';
import { StatusCodes } from 'http-status-codes';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import mailer from '@/mailer';
import ejs from 'ejs';
import path from 'path';
const hashPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const insertUser = async (name, email, hashedPassword) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
    [name, email, hashedPassword]
  );
  return result.insertId;
};

const insertStudentProfile = async (userId) => {
  const [result] = await db.execute(
    'INSERT INTO users_details (user_id) VALUES (?)',
    [userId]
  );
  return result.insertId;
};

const handleRegistrationError = (error) => {
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      {
        message: 'Validation failed',
        errors: error.errors,
      },
      { status: StatusCodes.BAD_REQUEST }
    );
  }
 
  console.error('Registration error:', error);
  return NextResponse.json(
    {
      message: 'Something went wrong, please try again later',
    },
    { status: StatusCodes.INTERNAL_SERVER_ERROR }
  );
};

export async function POST(req) {
  try {
    const body = await req.json();

    // Validate input
    await registerValidator.validate(body, { abortEarly: false });

    // Hash the password
    const hashedPassword = await hashPassword(body.password);

    // Insert user and student records
    const userId = await insertUser(body.name, body.email, hashedPassword);
    await insertStudentProfile(userId);
    console.log('User and student profile created successfully:', body);

    const emailContents = await ejs.renderFile(path.join(process.cwd(), 'src/mailers/registration/welcome.ejs'), { body });
    console.log('Email contents:', emailContents);
    await global.emailQueue.add({
      to: body.email,
      subject: 'Welcome to the College Web',
      from: 'No reply <no-reply@collegeweb.com>',
      html: emailContents
    });

    console.log('Email sent successfully:', body.email);
    return NextResponse.json(
      {
        message: 'User and student profile created successfully',
        user: {
          id: userId,
          name: body.name,
          email: body.email,
        },
      },
      { status: StatusCodes.CREATED }
    );
  } catch (error) {
    return handleRegistrationError(error);
  }
}
