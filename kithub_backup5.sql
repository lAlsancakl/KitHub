-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: kithub_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `kithub_db`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `kithub_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `kithub_db`;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `book_id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_count` int NOT NULL,
  `book_cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`book_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'a','b',222,'uploads/book_cover/2d33ea5fbf4b47b78f5a5e19f6a34c7a.jpg'),(2,'p?rt','c?s',31,'uploads/book_cover/eafa90a0243d4be68945be16f02f2a3d.jpg'),(3,'deneme','denemeci',31,'uploads/book_cover/f767af958bf54e3e8494d6e9c00d83c9.jpg'),(4,'Suç ve Ceza','Fyodor Dostoevsky',600,'uploads/book_cover/8ab0f72f5690461096a3b2954c03ed41.jpg'),(5,'zart','zort',9,'uploads/book_cover/689e19ffa8b14e3bbc52d1085a3916b4.jpg');
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `login_sessions`
--

DROP TABLE IF EXISTS `login_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login_sessions` (
  `session_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `token_hash` char(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  UNIQUE KEY `token_hash` (`token_hash`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `login_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_sessions`
--

LOCK TABLES `login_sessions` WRITE;
/*!40000 ALTER TABLE `login_sessions` DISABLE KEYS */;
INSERT INTO `login_sessions` VALUES (1,1,'e38a0faa0769c46a6ddd2c59092b5bc2c70d490182e9d14ef481a144851e2f30','2026-11-23 10:09:07','2026-11-16 10:09:07'),(2,1,'dd6f28173e57e697544bde0c5c8fa1145c3fdf288bbaf0765a784ec06eeeaf6b','2026-11-23 10:26:34','2026-11-16 10:26:33'),(34,6,'5199ca5075270a4e31096d0d5947c204b2cf4a143cb5be90992cd7f222a21a31','2026-11-25 19:48:30','2026-11-18 19:48:29');
/*!40000 ALTER TABLE `login_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `post_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `user_book_id` int DEFAULT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `post_type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`post_id`),
  KEY `fk_posts_user` (`user_id`),
  KEY `fk_posts_user_book` (`user_book_id`),
  CONSTRAINT `fk_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_posts_user_book` FOREIGN KEY (`user_book_id`) REFERENCES `user_books` (`user_book_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,3,1,'Added a by b to my reading list!','2026-11-18 13:21:08','reading'),(2,3,2,'Started reading p?rt by c?s!','2026-11-18 13:25:04','reading'),(3,3,3,'Finished reading deneme by denemeci in 100 days!','2026-11-18 13:25:58','reading'),(4,2,4,'Finished reading Suç ve Ceza by Fyodor Dostoevsky in 12 days!','2026-11-18 15:11:17','reading'),(5,5,5,'Stopped reading zart by zort.','2026-11-18 19:13:28','reading');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_books`
--

DROP TABLE IF EXISTS `user_books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_books` (
  `user_book_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `status` enum('want_to_read','reading','finished','dropped') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'want_to_read',
  `current_page` int DEFAULT '0',
  `started_at` date DEFAULT NULL,
  `finished_at` date DEFAULT NULL,
  `reading_days` int DEFAULT '0',
  PRIMARY KEY (`user_book_id`),
  UNIQUE KEY `uq_user_book` (`user_id`,`book_id`),
  KEY `fk_user_books_book` (`book_id`),
  CONSTRAINT `fk_user_books_book` FOREIGN KEY (`book_id`) REFERENCES `books` (`book_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_user_books_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_books`
--

LOCK TABLES `user_books` WRITE;
/*!40000 ALTER TABLE `user_books` DISABLE KEYS */;
INSERT INTO `user_books` VALUES (1,3,1,'want_to_read',0,NULL,NULL,0),(2,3,2,'reading',20,'2026-11-18',NULL,0),(3,3,3,'finished',31,'2026-08-11','2026-11-18',100),(4,2,4,'finished',600,'2026-11-07','2026-11-18',12),(5,5,5,'dropped',0,NULL,NULL,0);
/*!40000 ALTER TABLE `user_books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `gender` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `profile_photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'MrTerece','sha256$b29068e1c7ea2d98d8969e4fc0e2f6f1$41df2b87fafb12fdb3641e3a826ad44b469bc93168f4845736d5bf07e10ae182','male','2005-06-13','uploads/profiles/913534aebd6b49259fa8a25427271324.jpeg','2026-11-16 10:06:12'),(2,'Alsancak','sha256$30ebe72a6bb313bdae39dc96430508f8$32a25b43f81550da16484287b056824125b7f444de6829ce5c6f91969b4e0fd8','male','2005-07-12','uploads/profiles/9d9ac449faac4858bd01a4daa80c29cd.jpg','2026-11-16 17:57:08'),(3,'clawdee','sha256$858ca962e88ba9464e9810b02a4ec9b3$44e49102a41fddd730260a7574f8b52bd4838adbe7506b0a8e48879b2bf46466','female','2005-10-20','uploads/profiles/b8da655c14b94ea1a603d5f096d66717.jpg','2026-11-18 11:35:28'),(5,'beyza','sha256$57f31ff688f7d888128ed81ba9e3e574$8c5aa810a1382e4a4c0eb1598fce83589ecc4f2afcec340549350c5895b8f21a','female','2005-06-04','uploads/profiles/7f318da8c6e74c3dac943b71df62145a.jpg','2026-11-18 19:12:14'),(6,'lily','sha256$3a9147cdd2b33d65d3faa1bb1a4e643c$0b16871d358c30649d2661404929792ff30ceed85c25d7c932c4ae0586a4146b','female','2005-06-04','uploads/profiles/92007f36927349ec96048a8fdfd553a1.jpg','2026-11-18 19:48:23');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-18 22:55:06
