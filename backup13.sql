-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: kithub_db
-- ------------------------------------------------------
-- Server version	8.0.45

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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'a','b',222,'uploads/book_cover/2d33ea5fbf4b47b78f5a5e19f6a34c7a.jpg'),(2,'p?rt','c?s',31,'uploads/book_cover/eafa90a0243d4be68945be16f02f2a3d.jpg'),(3,'deneme','denemeci',31,'uploads/book_cover/f767af958bf54e3e8494d6e9c00d83c9.jpg'),(4,'Su? ve Ceza','Fyodor Dostoevsky',600,'uploads/book_cover/8ab0f72f5690461096a3b2954c03ed41.jpg'),(5,'Kahve so?umadan ?nce','kawaguchi',230,'uploads/book_cover/4df1b92853c249feaee4c5c458a71350.jpg'),(6,'the let them theory','mel robbins',336,'uploads/book_cover/b69948cbaa3c4ebdba94e22acfede718.jpg'),(7,'the happiness cure','anders hansen',180,'uploads/book_cover/e9bb9283e8e74d768d82e0356d0c5bab.jpg'),(8,'a girl returned','donatella di pietrantonio',176,'uploads/book_cover/d77596b3fb7a415f92382fc101b95434.jpg');
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
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_sessions`
--

LOCK TABLES `login_sessions` WRITE;
/*!40000 ALTER TABLE `login_sessions` DISABLE KEYS */;
INSERT INTO `login_sessions` VALUES (1,1,'e38a0faa0769c46a6ddd2c59092b5bc2c70d490182e9d14ef481a144851e2f30','2026-11-23 10:09:07','2026-11-16 10:09:07'),(2,1,'dd6f28173e57e697544bde0c5c8fa1145c3fdf288bbaf0765a784ec06eeeaf6b','2026-11-23 10:26:34','2026-11-16 10:26:33'),(35,1,'0f7fc1f2acfea678baae24a8f8ec78b264b79068868e809397e1839c5eee0886','2026-11-27 11:48:55','2026-11-20 11:48:54'),(36,7,'42d23d5a2a0e891c31e32791cd03b3cc774c79bcc2621ace1390c1016917d79e','2026-11-27 13:20:59','2026-11-20 13:20:58'),(39,6,'e3caeaef0f8434263082b39b627ae74954f2d57e208c06ced8be519f0d02a5b4','2026-11-27 17:56:49','2026-11-20 17:56:49'),(46,7,'a9c5717187f16c188bd0bcf67db3c25dc4dd86773b455369945aa8c78b7f1db5','2026-11-27 21:54:40','2026-11-20 21:54:40');
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
  `post_title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_spoiler` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`),
  KEY `fk_posts_user` (`user_id`),
  KEY `fk_posts_user_book` (`user_book_id`),
  CONSTRAINT `fk_posts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_posts_user_book` FOREIGN KEY (`user_book_id`) REFERENCES `user_books` (`user_book_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,3,1,'Added a by b to my reading list!','2026-11-18 13:21:08','reading',NULL,0),(2,3,2,'Started reading p?rt by c?s!','2026-11-18 13:25:04','reading',NULL,0),(3,3,3,'Finished reading deneme by denemeci in 100 days!','2026-11-18 13:25:58','reading',NULL,0),(4,2,4,'Finished reading Su? ve Ceza by Fyodor Dostoevsky in 12 days!','2026-11-18 15:11:17','reading',NULL,0),(5,1,5,'This is my first review.','2026-11-20 12:08:12','review','Test review',0),(6,1,5,'spoi','2026-11-20 12:21:46','review','spo',1),(7,1,7,'deneme123','2026-11-20 12:25:01','review','deneme',0),(8,7,8,'Finished reading Kahve so?umadan ?nce by kawaguchi in 8 days!','2026-11-20 13:22:08','reading',NULL,0),(9,7,8,'Okudu?ma ?ok memnunum herkese okumas?n? ?neririm','2026-11-20 13:22:36','review','G?zel bi kitapt?',0),(10,6,9,'Added the let them theory by mel robbins to my reading list!','2026-11-20 14:14:32','reading',NULL,0),(11,6,10,'Finished reading the happiness cure by anders hansen in 19 days!','2026-11-20 18:32:17','reading',NULL,0),(12,6,10,'deneme deneme 1 2 3','2026-11-20 18:33:11','review','merhaba',0),(13,6,11,'Started reading a girl returned by donatella di pietrantonio!','2026-11-20 18:34:48','reading',NULL,0),(14,2,4,'Okumanızı öneririm insanın işlediği bir suçtan dolayı yaşadığı vicdan azabını çok güzel anlatıyor. Dostoevskyi sevmem ama','2026-11-20 19:17:10','review','Güzel bi kitaptı',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_books`
--

LOCK TABLES `user_books` WRITE;
/*!40000 ALTER TABLE `user_books` DISABLE KEYS */;
INSERT INTO `user_books` VALUES (1,3,1,'want_to_read',0,NULL,NULL,0),(2,3,2,'reading',20,'2026-11-18',NULL,0),(3,3,3,'finished',31,'2026-08-11','2026-11-18',100),(4,2,4,'finished',600,'2026-11-07','2026-11-18',12),(5,1,4,'finished',600,NULL,'2026-11-20',0),(7,1,3,'finished',31,NULL,'2026-11-20',0),(8,7,5,'finished',230,'2026-11-13','2026-11-20',8),(9,6,6,'want_to_read',0,NULL,NULL,0),(10,6,7,'finished',180,'2026-11-02','2026-11-20',19),(11,6,8,'reading',75,'2026-11-20',NULL,0);
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
  `banner_photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT '/public/images/background.jpg',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'MrTerece','sha256$b29068e1c7ea2d98d8969e4fc0e2f6f1$41df2b87fafb12fdb3641e3a826ad44b469bc93168f4845736d5bf07e10ae182','male','2005-06-13','uploads/profiles/913534aebd6b49259fa8a25427271324.jpeg','/public/images/background.jpg','2026-11-16 10:06:12'),(2,'Alsancak','sha256$30ebe72a6bb313bdae39dc96430508f8$32a25b43f81550da16484287b056824125b7f444de6829ce5c6f91969b4e0fd8','male','2005-07-12','uploads/profiles/9d9ac449faac4858bd01a4daa80c29cd.jpg','/public/images/background.jpg','2026-11-16 17:57:08'),(3,'clawdee','sha256$858ca962e88ba9464e9810b02a4ec9b3$44e49102a41fddd730260a7574f8b52bd4838adbe7506b0a8e48879b2bf46466','female','2005-10-20','uploads/profiles/b8da655c14b94ea1a603d5f096d66717.jpg','/public/images/background.jpg','2026-11-18 11:35:28'),(5,'beyza','sha256$57f31ff688f7d888128ed81ba9e3e574$8c5aa810a1382e4a4c0eb1598fce83589ecc4f2afcec340549350c5895b8f21a','female','2005-06-04','uploads/profiles/7f318da8c6e74c3dac943b71df62145a.jpg','/public/images/background.jpg','2026-11-18 19:12:14'),(6,'lily','sha256$3a9147cdd2b33d65d3faa1bb1a4e643c$0b16871d358c30649d2661404929792ff30ceed85c25d7c932c4ae0586a4146b','female','2005-06-04','uploads/profiles/92007f36927349ec96048a8fdfd553a1.jpg','/public/images/background.jpg','2026-11-18 19:48:23'),(7,'testuser','sha256$f80391acf93f5d23864d0d09da8353de$bb6eb6695c575bbf856306af1af4118276e19dee3f18caae1fca3c1a2979cd29','male','2005-05-15','uploads/profiles/78778991da3f4a61854886c1c2e3227f.jpg','uploads/banners/0224354c741341eb9ba494111ff89b80.jpg','2026-11-19 17:20:07');
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

-- Dump completed on 2026-11-21  0:56:05
