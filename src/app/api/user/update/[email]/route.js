import { db } from '@/lib/db';
import formidable from 'formidable';
import { Readable } from 'stream';
import { readFile } from 'fs/promises';

export const config = {
  api: {
    bodyParser: false, // We need this to handle file uploads
  },
};

function toNodeReadable(webRequest) {
  const readable = Readable.from(webRequest.body);
  readable.headers = Object.fromEntries(webRequest.headers);
  readable.method = webRequest.method;
  readable.url = webRequest.url;
  return readable;
}

export async function PUT(req, { params }) {
  const data=await params
  const email  = data.email;
  const nodeReq = toNodeReadable(req);
    // Your existing logic follows
    const form = formidable({ multiples: false });
  
    return new Promise((resolve, reject) => {
      form.parse(nodeReq, async (err, fields, files) => {

        if (err) {
          console.error('Form parse error:', err);
          return resolve(Response.json({ error: 'Form parse error' }, { status: 500 }));
        }
  
        const getFieldValue = (field) => Array.isArray(field) ? field[0] : field;

        const major = getFieldValue(fields.major);
        const bio = getFieldValue(fields.bio);
        const address = getFieldValue(fields.address);
        const photoFile = files.photo;
  
        let photoBuffer = null;
  
        if (photoFile && photoFile[0]) {
          try {
            photoBuffer = await readFile(photoFile[0].filepath);
          } catch (fileErr) {
            console.error('Error reading file:', fileErr);
            return resolve(Response.json({ error: 'Failed to read uploaded file' }, { status: 500 }));
          }
        }
  
        try {
          const [result] = await db.execute(
            `UPDATE users_details s
            JOIN users u ON s.user_id = u.id
            SET s.major = ?, s.bio = ?, s.address = ?,
                s.photo = COALESCE(?, s.photo)  
            WHERE u.email = ?`,
           [major, bio, address, photoBuffer, email]
          );
  
          if (result.affectedRows === 0) {
            return resolve(Response.json({ error: 'No user found to update' }, { status: 404 }));
          }
  
          return resolve(Response.json({ message: 'Profile updated successfully' }, { status: 200 }));
        } catch (dbErr) {
          console.error('Database error:', dbErr);
          return resolve(Response.json({ error: 'Internal server error' }, { status: 500 }));
        }
      });
    });
  }
  