CREATE DATABASE IF NOT EXISTS kithub_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE kithub_db;

-- 1. USERS Tablosu
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    gender VARCHAR(20),
    birth_date DATE,
    profile_photo VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. BOOKS Tablosu
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    publisher VARCHAR(150),
    page_count INT NOT NULL,
    book_cover VARCHAR(255)
);

-- 3. USER_BOOKS Tablosu (Kullanıcı - Kitap Okuma Takibi)
CREATE TABLE user_books (
    user_book_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status ENUM('want_to_read', 'reading', 'finished', 'dropped') NOT NULL DEFAULT 'want_to_read',
    current_page INT DEFAULT 0,
    started_at DATE NULL,
    finished_at DATE NULL,
    reading_days INT DEFAULT 0,
    
    CONSTRAINT fk_user_books_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_user_books_book FOREIGN KEY (book_id) REFERENCES books(book_id) ON DELETE CASCADE,
    CONSTRAINT uq_user_book UNIQUE (user_id, book_id)
);

-- 4. POSTS Tablosu (Kitap silindiğinde postlar da silinecek şekilde ayarlandı)
CREATE TABLE posts (
    post_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    user_book_id INT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    post_type VARCHAR(30),
    
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_posts_user_book FOREIGN KEY (user_book_id) REFERENCES user_books(user_book_id) ON DELETE CASCADE
);