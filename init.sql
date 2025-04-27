CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'lecturer','admin') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_details (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  major VARCHAR(100),
  bio TEXT,
  address VARCHAR(255),
  phone VARCHAR(20),
  photo LONGBLOB DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);



-- Insert students and lecturers 
INSERT INTO users (name, email, password, role)
VALUES
  ('John Doe', 'john.doe@example.com', 'password123', 'student'),
  ('Jane Smith', 'jane.smith@example.com', 'password123', 'lecturer'),
  ('Alice Johnson', 'alice.johnson@example.com', 'password123', 'student'),
  ('Charlie White', 'charlie.white@example.com', 'password123', 'student'),
  ('David Lee', 'david.lee@example.com', 'password123', 'lecturer'),
  ('Frank Harris', 'frank.harris@example.com', 'password123', 'student'),
  ('Grace Lewis', 'grace.lewis@example.com', 'password123', 'lecturer'),
  ('Hannah Young', 'hannah.young@example.com', 'password123', 'student'),
  ('Irene Hall', 'irene.hall@example.com', 'password123', 'student'),
  ('Jack Allen', 'jack.allen@example.com', 'password123', 'student'),
  ('Kathy Scott', 'kathy.scott@example.com', 'password123', 'student'),
  ('Luke King', 'luke.king@example.com', 'password123', 'lecturer'),
  ('Megan Wright', 'megan.wright@example.com', 'password123', 'student'),
  ('Nancy Adams', 'nancy.adams@example.com', 'password123', 'student'),
  ('Oliver Walker', 'oliver.walker@example.com', 'password123', 'lecturer'),
  ('Paul Martinez', 'paul.martinez@example.com', 'password123', 'student'),
  ('Quinn Carter', 'quinn.carter@example.com', 'password123', 'student'),
  ('Rachel Green', 'rachel.green@example.com', 'password123', 'student'),
  ('Steve Rogers', 'steve.rogers@example.com', 'password123', 'lecturer'),
  ('Tommy Lee', 'tommy.lee@example.com', 'password123', 'student');


-- Insert corresponding dummy data into users_details table for the users
-- Ensure these user IDs match up correctly with the inserted users (starting from user_id = 1 to user_id = 20)
INSERT INTO users_details (user_id, major, bio, address, phone, photo)
VALUES
(1, 'Computer Science', 'Passionate about coding and technology.', '123 Elm St, Springfield, IL', '555-1234', NULL),
(2, 'Biology', 'Expert in algebra and statistics.', '456 Oak St, Springfield, IL', '555-5678', NULL),
(3, 'Engineering', 'Building the future through innovation.', '789 Pine St, Springfield, IL', '555-9101', NULL),
(4, 'Physics', 'Leader with a strategic vision.', '101 Maple St, Springfield, IL', '555-1122', NULL),
(5, 'Chemistry', 'Philosophical thinker with a love for logic.', '202 Birch St, Springfield, IL', '555-3344', NULL),
(6, 'Mathematics', 'Researching the fundamental laws of nature.', '303 Cedar St, Springfield, IL', '555-5567', NULL),
(7, 'Computer Science', 'Experienced in legal studies and practices.', '404 Walnut St, Springfield, IL', '555-7788', NULL),
(8, 'Biology', 'Exploring chemical reactions and solutions.', '505 Redwood St, Springfield, IL', '555-9900', NULL),
(9, 'Physics', 'Studying language and communication.', '606 Fir St, Springfield, IL', '555-2233', NULL),
(10, 'Engineering', 'Strategic business management.', '707 Pine St, Springfield, IL', '555-4455', NULL),
(11, 'Mathematics', 'Lover of books and creative writing.', '808 Cedar St, Springfield, IL', '555-6677', NULL),
(12, 'Chemistry', 'Composing and performing music for over 10 years.', '909 Birch St, Springfield, IL', '555-8899', NULL),
(13, 'Computer Science', 'Designing efficient systems and structures.', '1010 Oak St, Springfield, IL', '555-1122', NULL),
(14, 'Biology', 'Understanding human behavior and cognition.', '1111 Elm St, Springfield, IL', '555-3344', NULL),
(15, 'Engineering', 'Exploring the past to understand the present.', '1212 Maple St, Springfield, IL', '555-5567', NULL),
(16, 'Physics', 'Political theories and government practices.', '1313 Oak St, Springfield, IL', '555-7788', NULL),
(17, 'Chemistry', 'Analyzing economic systems and policies.', '1414 Pine St, Springfield, IL', '555-9900', NULL),
(18, 'Mathematics', 'Advocating for sustainability and green practices.', '1515 Cedar St, Springfield, IL', '555-2233', NULL),
(19, 'Biology', 'Exploring societal structures and behavior.', '1616 Redwood St, Springfield, IL', '555-4455', NULL),
(20, 'Physics', 'Exploring the intersection of creativity and expression.', '1717 Fir St, Springfield, IL', '555-6677', NULL);



-- Insert default admin user (use pre-hashed password)
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin College',
  'admin@college.com',
  '$2b$10$h3o/LOU.UPwu515rUjjX7O/wLdxL58kh1fTDAkJmnNEq.DfjhfjkK', -- placeholder hash for 'admin1234'
  'admin'
);

-- Get the user_id of the inserted admin user
SET @admin_user_id = LAST_INSERT_ID();

-- Insert corresponding blank details for the admin user
INSERT INTO users_details (user_id, major, bio, address, phone, photo)
VALUES
  (@admin_user_id, NULL, NULL, NULL, NULL, NULL);