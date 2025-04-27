import { db } from '@/lib/db';
import { requireSession, jsonResponse, errorResponse } from '@/lib/api';

export const config = {
  api: { bodyParser: false },
};

export async function GET(req, { params }) {
  const { id } = await   params;

  try {
    await requireSession();

    const [rows] = await db.execute('SELECT * FROM users_details WHERE id = ?', [id]);
    const student = rows[0];

    if (!student) return errorResponse('Student not found', 404);

    return jsonResponse(student);
  } catch (error) {
    console.error(error);
    return errorResponse(error.message || 'Internal Server Error', error.status || 500);
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;

  try {
    const session = await requireSession();
    const userId = session.user.id;
    const [[user]] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return errorResponse('User not found', 404);

    const formData = await req.formData();
    const name = formData.get('name');
    const major = formData.get('major');
    const bio = formData.get('bio');
    const address = formData.get('address');
    const role = formData.get('role');
    const file = formData.get('profilePhoto');

    let photoBuffer = null;
    if (file && typeof file.arrayBuffer === 'function') {
      const arrayBuffer = await file.arrayBuffer();
      photoBuffer = Buffer.from(arrayBuffer);
    }

    // Update users table
    const userUpdates = [];
    const userValues = [];

    if (name) userUpdates.push('name = ?'), userValues.push(name);
    const validRoles = ['student', 'admin', 'lecturer'];
    if (role && validRoles.includes(role) && user.role === 'admin') {
      userUpdates.push('role = ?'), userValues.push(role);
    }

    if (userUpdates.length > 0) {
      userValues.push(id);
      await db.execute(`UPDATE users SET ${userUpdates.join(', ')} WHERE id = ?`, userValues);
    }

    // Update users_details table
    const detailUpdates = [];
    const detailValues = [];

    if (major) detailUpdates.push('major = ?'), detailValues.push(major);
    if (bio) detailUpdates.push('bio = ?'), detailValues.push(bio);
    if (address) detailUpdates.push('address = ?'), detailValues.push(address);
    if (photoBuffer) detailUpdates.push('photo = ?'), detailValues.push(photoBuffer);

    if (detailUpdates.length > 0) {
      detailValues.push(id);
      await db.execute(`UPDATE users_details SET ${detailUpdates.join(', ')} WHERE user_id = ?`, detailValues);
    }

    return jsonResponse({ message: 'Data updated successfully' });
  } catch (error) {
    console.error(error);
    return errorResponse(error.message || 'Internal Server Error', error.status || 500);
  }
}

export async function DELETE(req, { params }) {
  const { id } =await params;

  try {
    const session = await requireSession();
    const userId = session.user.id;
    const [[user]] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
    if (!user) return errorResponse('User not found', 404);

    if (user.role === 'lecturer' && id !== String(userId)) {
      return errorResponse('You cannot delete other users', 403);
    }

    await db.execute('DELETE FROM users_details WHERE user_id = ?', [id]);
    await db.execute('DELETE FROM users WHERE id = ?', [id]);

    return jsonResponse({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return errorResponse(error.message || 'Internal Server Error', error.status || 500);
  }
}
