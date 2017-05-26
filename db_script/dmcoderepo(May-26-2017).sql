-- MySQL dump 10.13  Distrib 5.6.30, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: dmcoderepo
-- ------------------------------------------------------
-- Server version	5.6.30-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acl_meta`
--

DROP TABLE IF EXISTS `acl_meta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_meta` (
  `key` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_meta`
--

LOCK TABLES `acl_meta` WRITE;
/*!40000 ALTER TABLE `acl_meta` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_meta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_parents`
--

DROP TABLE IF EXISTS `acl_parents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_parents` (
  `key` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_parents`
--

LOCK TABLES `acl_parents` WRITE;
/*!40000 ALTER TABLE `acl_parents` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_parents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_permissions`
--

DROP TABLE IF EXISTS `acl_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_permissions` (
  `key` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_permissions`
--

LOCK TABLES `acl_permissions` WRITE;
/*!40000 ALTER TABLE `acl_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_resources`
--

DROP TABLE IF EXISTS `acl_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_resources` (
  `key` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_resources`
--

LOCK TABLES `acl_resources` WRITE;
/*!40000 ALTER TABLE `acl_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_roles`
--

DROP TABLE IF EXISTS `acl_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_roles` (
  `key` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_roles`
--

LOCK TABLES `acl_roles` WRITE;
/*!40000 ALTER TABLE `acl_roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acl_users`
--

DROP TABLE IF EXISTS `acl_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `acl_users` (
  `key` varchar(255) NOT NULL DEFAULT '',
  `value` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acl_users`
--

LOCK TABLES `acl_users` WRITE;
/*!40000 ALTER TABLE `acl_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `acl_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codebase`
--

DROP TABLE IF EXISTS `codebase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `codebase` (
  `codebase_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `domain_id` int(11) NOT NULL,
  `author_id` int(11) NOT NULL,
  `uploaded_on` timestamp NULL DEFAULT NULL,
  `updated_on` datetime NOT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `downloads` int(10) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `file_path` varchar(300) DEFAULT NULL,
  `reference` varchar(350) DEFAULT NULL,
  `projects` varchar(350) DEFAULT NULL,
  PRIMARY KEY (`codebase_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codebase`
--

LOCK TABLES `codebase` WRITE;
/*!40000 ALTER TABLE `codebase` DISABLE KEYS */;
/*!40000 ALTER TABLE `codebase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `domain`
--

DROP TABLE IF EXISTS `domain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `domain` (
  `domain_id` int(11) NOT NULL AUTO_INCREMENT,
  `domain` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`domain_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `domain`
--

LOCK TABLES `domain` WRITE;
/*!40000 ALTER TABLE `domain` DISABLE KEYS */;
INSERT INTO `domain` VALUES (1,'PHP','test',0),(2,'Java','test',0),(3,'Python','test',0),(4,'C++','Test',0),(5,'Hello','Test',0),(6,'TestNew','test',0),(7,'DotNet','sd',0);
/*!40000 ALTER TABLE `domain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sub_domain`
--

DROP TABLE IF EXISTS `sub_domain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sub_domain` (
  `sub_domain_id` int(11) NOT NULL,
  `sub_domain` varchar(100) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `domain_id` int(11) NOT NULL,
  `status` int(11) DEFAULT '0',
  PRIMARY KEY (`sub_domain_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sub_domain`
--

LOCK TABLES `sub_domain` WRITE;
/*!40000 ALTER TABLE `sub_domain` DISABLE KEYS */;
INSERT INTO `sub_domain` VALUES (1,'Yii1','we',1,NULL),(2,'Yii2','df',1,NULL),(3,'Django','dsf',3,NULL),(25,'CF','test',1,NULL),(26,'Core Phop','ywey',1,NULL);
/*!40000 ALTER TABLE `sub_domain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(20) NOT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `emp_code` varchar(8) NOT NULL,
  `doj` date DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `auth_key` varchar(32) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Riju','R','riju@dmail.com','$2a$10$4Lw6HcUELWpLRCMDifXFoewpEv7jr1HXz7DoNoJQhuhBEPnpVxWqW',NULL,'0000-00-00','1234567890','123',NULL,1,NULL,''),(2,'Tyson','Paul','tyson@dmail.com','$2a$10$dPDCCqF0B/Zo/7N5RL3lauDj1FCNHpEQHw.lf4S4o0caJhdtX5Kia',NULL,'1989-07-20','1234567890','dme464',NULL,1,NULL,'bridge.jpg'),(3,'Srikanth','Kamath','srikanth@dmail.com','$2a$10$LIC0CxnmZ5OCWTpR8JjkTu4McTsLiff0YX5PIXPTL1VwujZ5/BCce',NULL,'0000-00-00','1234567890','dme007',NULL,1,NULL,'Selection_012.png');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-26 18:21:55
