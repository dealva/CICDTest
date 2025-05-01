import 'whatwg-fetch';
import "@testing-library/jest-dom"
import { db } from '@/lib/db';

afterAll(async ()=>{
    await db.query('SET FOREIGN_KEY_CHECKS = 0'); // Temporarily disable constraints
    await db.query('TRUNCATE TABLE users_details'); // Child table
    await db.query('TRUNCATE TABLE users');         // Parent table
    await db.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable constraints
    await db.end(); // close connection pool
})