import { db } from '@/lib/db';

describe('Database connection', () => {
  it('should connect and execute a simple query', async () => {
    const [rows] = await db.query('SELECT 1 + 1 AS result');
    expect(rows[0].result).toBe(2);
  });
});
