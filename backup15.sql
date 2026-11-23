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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'a','b',222,'uploads/book_cover/2d33ea5fbf4b47b78f5a5e19f6a34c7a.jpg'),(2,'p?rt','c?s',31,'uploads/book_cover/eafa90a0243d4be68945be16f02f2a3d.jpg'),(3,'deneme','denemeci',31,'uploads/book_cover/f767af958bf54e3e8494d6e9c00d83c9.jpg'),(4,'Su? ve Ceza','Fyodor Dostoevsky',600,'uploads/book_cover/8ab0f72f5690461096a3b2954c03ed41.jpg'),(5,'Kahve so?umadan ?nce','kawaguchi',230,'uploads/book_cover/4df1b92853c249feaee4c5c458a71350.jpg'),(6,'the let them theory','mel robbins',336,'uploads/book_cover/b69948cbaa3c4ebdba94e22acfede718.jpg'),(7,'the happiness cure','anders hansen',180,'uploads/book_cover/e9bb9283e8e74d768d82e0356d0c5bab.jpg'),(8,'a girl returned','donatella di pietrantonio',176,'uploads/book_cover/d77596b3fb7a415f92382fc101b95434.jpg'),(9,'Rashomon','Ryunosuke Akutagawa',126,'uploads/book_cover/7d08793f85a443848c35ce5f40eaa50f.jpg'),(10,'Algernon\'a Çiçekler','Danıel Keyes',324,'uploads/book_cover/5159d7f03e68435da4080dab252101d1.webp'),(11,'Hizmetçi','Freida McFadden',352,'uploads/book_cover/4dc18eebbd624bee8a31367b9cd493f4.webp'),(12,'Şeker Portakalı','Jose Mauro De Vasconcelos',183,'uploads/book_cover/7f720be6bed54e74ad7d2e4d013a94e2.jpg'),(13,'Ecinniler','Fyodor Dostoevsky',893,'uploads/book_cover/d12ea0a13f94420a95703edee7d712bb.jpg'),(14,'Bin Muhteşem Güneş','Khaled Hosseini',430,'uploads/book_cover/716401a5b68545e189a6943123fee0b2.webp'),(15,'Atomik Alışkanlıklar','James Clear',339,'uploads/book_cover/3257eaa9a04a47e3a4e47aac0db4f918.webp'),(16,'Hyunam-Dong Kitabevi','Hwang BoReum',288,'uploads/book_cover/0bf505448d0e4ba4bd7b84a495cefd97.webp');
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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login_sessions`
--

LOCK TABLES `login_sessions` WRITE;
/*!40000 ALTER TABLE `login_sessions` DISABLE KEYS */;
INSERT INTO `login_sessions` VALUES (1,1,'e38a0faa0769c46a6ddd2c59092b5bc2c70d490182e9d14ef481a144851e2f30','2026-11-23 10:09:07','2026-11-16 10:09:07'),(2,1,'dd6f28173e57e697544bde0c5c8fa1145c3fdf288bbaf0765a784ec06eeeaf6b','2026-11-23 10:26:34','2026-11-16 10:26:33'),(35,1,'0f7fc1f2acfea678baae24a8f8ec78b264b79068868e809397e1839c5eee0886','2026-11-27 11:48:55','2026-11-20 11:48:54'),(36,7,'42d23d5a2a0e891c31e32791cd03b3cc774c79bcc2621ace1390c1016917d79e','2026-11-27 13:20:59','2026-11-20 13:20:58'),(39,6,'e3caeaef0f8434263082b39b627ae74954f2d57e208c06ced8be519f0d02a5b4','2026-11-27 17:56:49','2026-11-20 17:56:49'),(64,7,'138005000f693e8489b3df9adc9b7a7c88bd4b3614564a903c33dcfaca96d6f8','2026-11-30 20:38:39','2026-11-23 20:38:39');
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
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,3,1,'Added a by b to my reading list!','2026-11-18 13:21:08','reading',NULL,0),(2,3,2,'Started reading p?rt by c?s!','2026-11-18 13:25:04','reading',NULL,0),(3,3,3,'Finished reading deneme by denemeci in 100 days!','2026-11-18 13:25:58','reading',NULL,0),(4,2,4,'Finished reading Su? ve Ceza by Fyodor Dostoevsky in 12 days!','2026-11-18 15:11:17','reading',NULL,0),(5,1,5,'This is my first review.','2026-11-20 12:08:12','review','Test review',0),(6,1,5,'spoi','2026-11-20 12:21:46','review','spo',1),(7,1,7,'deneme123','2026-11-20 12:25:01','review','deneme',0),(8,7,8,'Finished reading Kahve so?umadan ?nce by kawaguchi in 8 days!','2026-11-20 13:22:08','reading',NULL,0),(9,7,8,'Okudu?ma ?ok memnunum herkese okumas?n? ?neririm','2026-11-20 13:22:36','review','G?zel bi kitapt?',0),(10,6,9,'Added the let them theory by mel robbins to my reading list!','2026-11-20 14:14:32','reading',NULL,0),(11,6,10,'Finished reading the happiness cure by anders hansen in 19 days!','2026-11-20 18:32:17','reading',NULL,0),(12,6,10,'deneme deneme 1 2 3','2026-11-20 18:33:11','review','merhaba',0),(13,6,11,'Started reading a girl returned by donatella di pietrantonio!','2026-11-20 18:34:48','reading',NULL,0),(14,2,4,'Okumanızı öneririm insanın işlediği bir suçtan dolayı yaşadığı vicdan azabını çok güzel anlatıyor. Dostoevskyi sevmem ama','2026-11-20 19:17:10','review','Güzel bi kitaptı',0),(15,2,12,'Started reading Rashomon by Ryunosuke Akutagawa!','2026-11-23 19:10:34','reading',NULL,0),(16,2,12,'Bence içindeki ilk kısım ve cehennemdeki örümcek ağı kısmı ilgi çekiciydi gerisinin pek akılda kalıcı olduğunu düşünmüyorum.','2026-11-23 19:16:52','review','Overrated',0),(17,7,13,'Started reading Algernon\'a Çiçekler by Danıel Keyes!','2026-11-23 19:24:27','reading',NULL,0),(18,7,14,'Finished reading Hizmetçi by Freida McFadden in 4 days!','2026-11-23 19:25:55','reading',NULL,0),(19,7,14,'Kitap çok sürükleyiciydi. Kitabın bir noktasında çok güzel bir ters köşe var ve o andan itibaren kitap tamamen akıp gidiyor. Sonunda biraz plot armor varmış gibi hissettirdi ama ben sonunu beğendim. İzlemek isteyen olursa kitabın bir filminin de olduğunu söylemek istiyorum.','2026-11-23 19:26:21','review','Müthişti',0),(20,1,15,'Started reading Şeker Portakalı by Jose Mauro De Vasconcelos!','2026-11-23 20:19:58','reading',NULL,0),(21,1,16,'Finished reading Ecinniler by Fyodor Dostoevsky in 26 days!','2026-11-23 20:21:10','reading',NULL,0),(22,1,16,'Dostoyevski\'nin Ecinnileri, ideolojik saplantıların ve körü körüne bağlılığın bireyi nasıl sürüklediğini çarpıcı bir psikolojik ve siyasi gerilimle işler. Karakterlerin iç çatışmaları ve kasabadaki huzursuzluğun giderek büyümesi romanı baştan sona diri tutar. Yoğun diyalogları ve felsefi alt metni yer yer okuru zorlasa da kurduğu karanlık atmosfer oldukça etkileyicidir. Klasik edebiyatta insan doğasının uç noktalarını ve toplumsal çalkantıları okumak isteyenler için güçlü ve sarsıcı bir eser.','2026-11-23 20:21:46','review','Kesinlikle okuyun',0),(23,3,17,'Started reading Bin Muhteşem Güneş by Khaled Hosseini!','2026-11-23 20:23:45','reading',NULL,0),(24,6,18,'Started reading Atomik Alışkanlıklar by James Clear!','2026-11-23 20:25:50','reading',NULL,0),(25,3,19,'Finished reading Hyunam-Dong Kitabevi by Hwang BoReum in 5 days!','2026-11-23 20:27:15','reading',NULL,0),(26,3,19,'Günlük hayatın koşturmasının yanında okuyabileceğiniz çok tatlı bir kitap. Eksi gördüğüm bir şey olmadı kafa dağıtmak istiyorsanız ve biraz huzur arıyorsanız öneririm.','2026-11-23 20:28:12','review','Soft bir kitaptı',0),(27,2,12,'Raşomon, insan doğasının ne kadar karmaşık ve çelişkili olabileceğini oldukça etkileyici bir şekilde anlatıyor. Herkesin olaylara kendi açısından bakması ve gerçeğin kişiden kişiye değişmesi üzerine düşündüren, kısa ama akılda kalıcı bir kitap.','2026-11-23 20:32:15','review','İkinci okumamdaki görüşlerim',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_books`
--

LOCK TABLES `user_books` WRITE;
/*!40000 ALTER TABLE `user_books` DISABLE KEYS */;
INSERT INTO `user_books` VALUES (1,3,1,'want_to_read',0,NULL,NULL,0),(2,3,2,'reading',20,'2026-11-18',NULL,0),(3,3,3,'finished',31,'2026-08-11','2026-11-18',100),(4,2,4,'finished',600,'2026-11-07','2026-11-18',12),(5,1,4,'finished',600,NULL,'2026-11-20',0),(7,1,3,'finished',31,NULL,'2026-11-20',0),(8,7,5,'finished',230,'2026-11-13','2026-11-20',8),(9,6,6,'want_to_read',0,NULL,NULL,0),(10,6,7,'finished',180,'2026-11-02','2026-11-20',19),(11,6,8,'reading',75,'2026-11-20',NULL,0),(12,2,9,'finished',126,'2026-11-23','2026-11-23',5),(13,7,10,'reading',129,'2026-11-23',NULL,0),(14,7,11,'finished',352,'2026-11-20','2026-11-23',4),(15,1,12,'reading',94,'2026-11-23',NULL,0),(16,1,13,'finished',893,'2026-10-29','2026-11-23',26),(17,3,14,'reading',148,'2026-11-23',NULL,0),(18,6,15,'reading',143,'2026-11-23',NULL,0),(19,3,16,'finished',288,'2026-11-19','2026-11-23',5);
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
INSERT INTO `users` VALUES (1,'MrTerece','sha256$b29068e1c7ea2d98d8969e4fc0e2f6f1$41df2b87fafb12fdb3641e3a826ad44b469bc93168f4845736d5bf07e10ae182','male','2005-06-13','uploads/profiles/913534aebd6b49259fa8a25427271324.jpeg','uploads/banners/f8411c04177247a28d5ce2ac35920537.jpg','2026-11-16 10:06:12'),(2,'Alsancak','sha256$30ebe72a6bb313bdae39dc96430508f8$32a25b43f81550da16484287b056824125b7f444de6829ce5c6f91969b4e0fd8','male','2005-07-12','uploads/profiles/9d9ac449faac4858bd01a4daa80c29cd.jpg','/public/images/background.jpg','2026-11-16 17:57:08'),(3,'clawdee','sha256$858ca962e88ba9464e9810b02a4ec9b3$44e49102a41fddd730260a7574f8b52bd4838adbe7506b0a8e48879b2bf46466','female','2005-10-20','uploads/profiles/b8da655c14b94ea1a603d5f096d66717.jpg','uploads/banners/bb4e2e9679384658b02b36e43c04c328.webp','2026-11-18 11:35:28'),(5,'beyza','sha256$57f31ff688f7d888128ed81ba9e3e574$8c5aa810a1382e4a4c0eb1598fce83589ecc4f2afcec340549350c5895b8f21a','female','2005-06-04','uploads/profiles/7f318da8c6e74c3dac943b71df62145a.jpg','/public/images/background.jpg','2026-11-18 19:12:14'),(6,'lily','sha256$3a9147cdd2b33d65d3faa1bb1a4e643c$0b16871d358c30649d2661404929792ff30ceed85c25d7c932c4ae0586a4146b','female','2005-06-04','uploads/profiles/92007f36927349ec96048a8fdfd553a1.jpg','uploads/banners/58122fc0be9c4fa38b12fd2fc8b666af.webp','2026-11-18 19:48:23'),(7,'testuser','sha256$f80391acf93f5d23864d0d09da8353de$bb6eb6695c575bbf856306af1af4118276e19dee3f18caae1fca3c1a2979cd29','male','2005-05-15','uploads/profiles/78778991da3f4a61854886c1c2e3227f.jpg','uploads/banners/0224354c741341eb9ba494111ff89b80.jpg','2026-11-19 17:20:07');
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

-- Dump completed on 2026-11-23 23:48:55
