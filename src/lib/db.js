import mysql from 'mysql2/promise';

// Database connection setup
export const db = mysql.createPool({
  host: 'localhost',  
  user: 'college_db_user', 
  password: 'college_db_pass', 
  database: 'college_db', 
  connectTimeout: 10000, // 10 seconds 
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});