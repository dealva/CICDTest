import mysql from 'mysql2/promise';

// Database connection setup
export const db = mysql.createPool({
  host: 'localhost',  
  user: process.env.MYSQL_USER, 
  password: process.env.MYSQL_PASSWORD, 
  database: process.env.MYSQL_DATABASE,  
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});