-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: kindergarten_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attendances`
--

DROP TABLE IF EXISTS `attendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attendances` (
  `AttendanceID` int(11) NOT NULL AUTO_INCREMENT,
  `AttendanceDate` datetime NOT NULL,
  `Status` enum('Present','Absent','Late','Excused') NOT NULL,
  `Reason` text DEFAULT NULL,
  `child_PersonID` int(11) NOT NULL,
  `classID` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`AttendanceID`),
  KEY `child_PersonID` (`child_PersonID`),
  KEY `classID` (`classID`),
  CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_10` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_11` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_12` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_13` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_14` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_15` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_16` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_17` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_18` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_19` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_20` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_21` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_22` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_23` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_24` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_25` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_26` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_27` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_28` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_29` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_3` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_30` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_31` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_32` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_33` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_34` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_35` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_36` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_37` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_38` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_39` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_4` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_40` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_41` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_42` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_43` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_44` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_45` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_46` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_47` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_48` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_49` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_5` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_50` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_51` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_52` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_53` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_54` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_55` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_56` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_6` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_7` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_8` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `attendances_ibfk_9` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendances`
--

LOCK TABLES `attendances` WRITE;
/*!40000 ALTER TABLE `attendances` DISABLE KEYS */;
/*!40000 ALTER TABLE `attendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_guardians`
--

DROP TABLE IF EXISTS `child_guardians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `child_guardians` (
  `child_PersonID` int(11) NOT NULL,
  `GID` int(11) NOT NULL,
  `RelationTypeID` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`child_PersonID`,`GID`,`RelationTypeID`),
  UNIQUE KEY `Child_Guardians_GID_child_PersonID_unique` (`child_PersonID`,`GID`),
  KEY `GID` (`GID`),
  KEY `RelationTypeID` (`RelationTypeID`),
  CONSTRAINT `child_guardians_ibfk_1` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `child_guardians_ibfk_2` FOREIGN KEY (`GID`) REFERENCES `guardians` (`GID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `child_guardians_ibfk_3` FOREIGN KEY (`RelationTypeID`) REFERENCES `relationtypes` (`RelationTypeID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_guardians`
--

LOCK TABLES `child_guardians` WRITE;
/*!40000 ALTER TABLE `child_guardians` DISABLE KEYS */;
/*!40000 ALTER TABLE `child_guardians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `child_health_medicines`
--

DROP TABLE IF EXISTS `child_health_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `child_health_medicines` (
  `child_PersonID` int(11) NOT NULL,
  `CH_M_ID` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`child_PersonID`),
  UNIQUE KEY `CH_M_ID` (`CH_M_ID`),
  CONSTRAINT `child_health_medicines_ibfk_1` FOREIGN KEY (`child_PersonID`) REFERENCES `children` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_10` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_11` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_12` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_13` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_14` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_15` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_16` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_17` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_18` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_19` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_2` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_20` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_21` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_22` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_23` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_24` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_25` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_26` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_27` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_3` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_4` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_5` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_6` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_7` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_8` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `child_health_medicines_ibfk_9` FOREIGN KEY (`CH_M_ID`) REFERENCES `health_medicines` (`CH_M_ID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `child_health_medicines`
--

LOCK TABLES `child_health_medicines` WRITE;
/*!40000 ALTER TABLE `child_health_medicines` DISABLE KEYS */;
INSERT INTO `child_health_medicines` VALUES (1,1,'2026-09-14 09:49:19','2026-09-14 09:49:19'),(3,2,'2026-09-14 09:49:38','2026-09-14 09:49:38'),(5,3,'2026-09-14 09:50:07','2026-09-14 09:50:07'),(7,4,'2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `child_health_medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `children` (
  `PersonID` int(11) NOT NULL,
  `F_name` varchar(50) NOT NULL,
  `S_name` varchar(50) DEFAULT NULL,
  `Th_name` varchar(50) DEFAULT NULL,
  `L_name` varchar(50) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `birth_date` date NOT NULL,
  `birthplace` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `education_stage` varchar(50) DEFAULT NULL,
  `num_of_brothers` int(11) DEFAULT 0,
  `status_of_parents` varchar(50) DEFAULT NULL,
  `child_order` int(11) DEFAULT NULL,
  `classID` int(11) DEFAULT NULL,
  `section_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`PersonID`),
  KEY `classID` (`classID`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `children_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `persons` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_10` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_11` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_12` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_13` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_14` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_15` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_16` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_17` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_18` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_19` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_2` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_20` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_21` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_22` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_23` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_24` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_25` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_26` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_27` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_28` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_29` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_3` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_30` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_31` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_32` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_33` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_34` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_35` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_36` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_37` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_38` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_39` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_4` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_40` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_41` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_42` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_43` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_44` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_45` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_46` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_47` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_48` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_49` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_5` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_50` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_51` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_52` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_53` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_54` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_55` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_56` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_57` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_6` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_7` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_8` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `children_ibfk_9` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,'كرم','','','النجار','Male','2021-05-10','','','تمهيدي',0,'معاً',1,NULL,NULL,'2026-09-14 09:49:19','2026-09-14 09:49:19'),(3,'كرم','','','النجار','Male','2021-05-10','','','تمهيدي',0,'معاً',1,NULL,NULL,'2026-09-14 09:49:38','2026-09-14 09:49:38'),(5,'كرم','','','النجار','Male','2021-05-10','','','تمهيدي',0,'معاً',1,NULL,NULL,'2026-09-14 09:50:07','2026-09-14 09:50:07'),(7,'كرم','','','النجار','Male','2021-05-10','','','تمهيدي',0,'معاً',1,NULL,NULL,'2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classroom_classsessions`
--

DROP TABLE IF EXISTS `classroom_classsessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classroom_classsessions` (
  `classID` int(11) NOT NULL,
  `SessionID` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`classID`,`SessionID`),
  UNIQUE KEY `ClassRoom_ClassSessions_SessionID_classID_unique` (`classID`,`SessionID`),
  KEY `SessionID` (`SessionID`),
  CONSTRAINT `classroom_classsessions_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `classroom_classsessions_ibfk_2` FOREIGN KEY (`SessionID`) REFERENCES `classsessions` (`SessionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classroom_classsessions`
--

LOCK TABLES `classroom_classsessions` WRITE;
/*!40000 ALTER TABLE `classroom_classsessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `classroom_classsessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classrooms`
--

DROP TABLE IF EXISTS `classrooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classrooms` (
  `classID` int(11) NOT NULL AUTO_INCREMENT,
  `className` varchar(100) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`classID`),
  UNIQUE KEY `className` (`className`),
  UNIQUE KEY `className_2` (`className`),
  UNIQUE KEY `className_3` (`className`),
  UNIQUE KEY `className_4` (`className`),
  UNIQUE KEY `className_5` (`className`),
  UNIQUE KEY `className_6` (`className`),
  UNIQUE KEY `className_7` (`className`),
  UNIQUE KEY `className_8` (`className`),
  UNIQUE KEY `className_9` (`className`),
  UNIQUE KEY `className_10` (`className`),
  UNIQUE KEY `className_11` (`className`),
  UNIQUE KEY `className_12` (`className`),
  UNIQUE KEY `className_13` (`className`),
  UNIQUE KEY `className_14` (`className`),
  UNIQUE KEY `className_15` (`className`),
  UNIQUE KEY `className_16` (`className`),
  UNIQUE KEY `className_17` (`className`),
  UNIQUE KEY `className_18` (`className`),
  UNIQUE KEY `className_19` (`className`),
  UNIQUE KEY `className_20` (`className`),
  UNIQUE KEY `className_21` (`className`),
  UNIQUE KEY `className_22` (`className`),
  UNIQUE KEY `className_23` (`className`),
  UNIQUE KEY `className_24` (`className`),
  UNIQUE KEY `className_25` (`className`),
  UNIQUE KEY `className_26` (`className`),
  UNIQUE KEY `className_27` (`className`),
  UNIQUE KEY `className_28` (`className`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classrooms`
--

LOCK TABLES `classrooms` WRITE;
/*!40000 ALTER TABLE `classrooms` DISABLE KEYS */;
INSERT INTO `classrooms` VALUES (1,'قاعة الأمل 2872','2026-09-14 09:50:07','2026-09-14 09:50:07'),(2,'قاعة الأمل 2432','2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `classrooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `classsessions`
--

DROP TABLE IF EXISTS `classsessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `classsessions` (
  `SessionID` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date NOT NULL,
  `day` varchar(20) NOT NULL,
  `Period` varchar(50) NOT NULL,
  `Study_class_number` varchar(50) DEFAULT NULL,
  `SubjectID` int(11) NOT NULL,
  `section_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`SessionID`),
  KEY `SubjectID` (`SubjectID`),
  KEY `section_id` (`section_id`),
  CONSTRAINT `classsessions_ibfk_1` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_10` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_11` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_12` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_13` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_14` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_15` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_16` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_17` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_18` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_19` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_2` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_20` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_21` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_22` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_23` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_24` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_25` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_26` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_27` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_28` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_29` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_3` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_30` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_31` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_32` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_33` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_34` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_35` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_36` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_37` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_38` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_39` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_4` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_40` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_41` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_42` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_43` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_44` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_45` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_46` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_47` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_48` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_49` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_5` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_50` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_51` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_52` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_53` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_54` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_55` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_56` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_6` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_7` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_8` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `classsessions_ibfk_9` FOREIGN KEY (`SubjectID`) REFERENCES `subjects` (`SubjectID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `classsessions`
--

LOCK TABLES `classsessions` WRITE;
/*!40000 ALTER TABLE `classsessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `classsessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `guardians`
--

DROP TABLE IF EXISTS `guardians`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `guardians` (
  `GID` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `G_F_name` varchar(50) NOT NULL,
  `G_S_name` varchar(50) DEFAULT NULL,
  `G_Th_name` varchar(50) DEFAULT NULL,
  `G_L_name` varchar(50) NOT NULL,
  `G_phone` varchar(20) DEFAULT NULL,
  `emergency_number` varchar(20) DEFAULT NULL,
  `W_phone` varchar(20) DEFAULT NULL,
  `work` varchar(100) DEFAULT NULL,
  `W_place` varchar(100) DEFAULT NULL,
  `educational_level` varchar(50) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`GID`),
  UNIQUE KEY `userId` (`userId`),
  CONSTRAINT `guardians_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_11` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_15` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_17` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_19` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_21` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_23` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_25` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_27` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_3` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_5` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_7` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `guardians_ibfk_9` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `guardians`
--

LOCK TABLES `guardians` WRITE;
/*!40000 ALTER TABLE `guardians` DISABLE KEYS */;
/*!40000 ALTER TABLE `guardians` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `health_medicines`
--

DROP TABLE IF EXISTS `health_medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `health_medicines` (
  `CH_M_ID` int(11) NOT NULL AUTO_INCREMENT,
  `Diseases` text DEFAULT NULL,
  `vaccinations` text DEFAULT NULL,
  `allergies` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`CH_M_ID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `health_medicines`
--

LOCK TABLES `health_medicines` WRITE;
/*!40000 ALTER TABLE `health_medicines` DISABLE KEYS */;
INSERT INTO `health_medicines` VALUES (1,'لا يوجد','تطعيم الحصبة والجدري مكتملة','حساسية من الفول السوداني','2026-09-14 09:49:19','2026-09-14 09:49:19'),(2,'لا يوجد','تطعيم الحصبة والجدري مكتملة','حساسية من الفول السوداني','2026-09-14 09:49:38','2026-09-14 09:49:38'),(3,'لا يوجد','تطعيم الحصبة والجدري مكتملة','حساسية من الفول السوداني','2026-09-14 09:50:07','2026-09-14 09:50:07'),(4,'لا يوجد','تطعيم الحصبة والجدري مكتملة','حساسية من الفول السوداني','2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `health_medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `senderId` int(11) NOT NULL,
  `receiverId` int(11) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `content` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `readAt` datetime DEFAULT NULL,
  `replyTo` int(11) DEFAULT NULL,
  `attachments` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attachments`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `senderId` (`senderId`),
  KEY `receiverId` (`receiverId`),
  KEY `replyTo` (`replyTo`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_10` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_11` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_12` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_13` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_14` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_15` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_16` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_17` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_18` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_19` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_20` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_21` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_22` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_23` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_24` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_25` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_26` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_27` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_28` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_29` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_30` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_31` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_32` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_33` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_34` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_35` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_36` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_37` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_38` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_39` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_4` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_40` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_41` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_42` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_43` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_44` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_45` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_46` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_47` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_48` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_49` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_5` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_50` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_51` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_52` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_53` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_54` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_55` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_56` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_57` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_58` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_59` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_6` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_60` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_61` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_62` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_63` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_64` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_65` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_66` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_67` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_68` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_69` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_7` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_70` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_71` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_72` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_73` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_74` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_75` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_76` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_77` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_78` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_79` FOREIGN KEY (`senderId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_8` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_80` FOREIGN KEY (`receiverId`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_81` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `messages_ibfk_9` FOREIGN KEY (`replyTo`) REFERENCES `messages` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notes` (
  `NoteID` int(11) NOT NULL AUTO_INCREMENT,
  `NoteDate` datetime NOT NULL,
  `NoteCategory` varchar(50) NOT NULL,
  `NoteText` text NOT NULL,
  `SenderID` int(11) NOT NULL,
  `ReceiverID` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`NoteID`),
  KEY `SenderID` (`SenderID`),
  KEY `ReceiverID` (`ReceiverID`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_10` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_11` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_12` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_13` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_14` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_15` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_16` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_17` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_18` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_19` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_2` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_20` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_21` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_22` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_23` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_24` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_25` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_26` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_27` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_28` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_29` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_3` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_30` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_31` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_32` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_33` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_34` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_35` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_36` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_37` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_38` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_39` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_4` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_40` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_41` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_42` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_43` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_44` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_45` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_46` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_47` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_48` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_49` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_5` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_50` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_51` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_52` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_53` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_54` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_6` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_7` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_8` FOREIGN KEY (`ReceiverID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `notes_ibfk_9` FOREIGN KEY (`SenderID`) REFERENCES `persons` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `persons`
--

DROP TABLE IF EXISTS `persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `persons` (
  `PersonID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`PersonID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `persons`
--

LOCK TABLES `persons` WRITE;
/*!40000 ALTER TABLE `persons` DISABLE KEYS */;
INSERT INTO `persons` VALUES (1,'كرم النجار','2026-09-14 09:49:19','2026-09-14 09:49:19'),(2,'أحمد محمود','2026-09-14 09:49:19','2026-09-14 09:49:19'),(3,'كرم النجار','2026-09-14 09:49:38','2026-09-14 09:49:38'),(4,'أحمد محمود','2026-09-14 09:49:38','2026-09-14 09:49:38'),(5,'كرم النجار','2026-09-14 09:50:07','2026-09-14 09:50:07'),(6,'أحمد محمود','2026-09-14 09:50:07','2026-09-14 09:50:07'),(7,'كرم النجار','2026-09-14 09:50:24','2026-09-14 09:50:24'),(8,'أحمد محمود','2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relationtypes`
--

DROP TABLE IF EXISTS `relationtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relationtypes` (
  `RelationTypeID` int(11) NOT NULL AUTO_INCREMENT,
  `relation_type` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`RelationTypeID`),
  UNIQUE KEY `relation_type` (`relation_type`),
  UNIQUE KEY `relation_type_2` (`relation_type`),
  UNIQUE KEY `relation_type_3` (`relation_type`),
  UNIQUE KEY `relation_type_4` (`relation_type`),
  UNIQUE KEY `relation_type_5` (`relation_type`),
  UNIQUE KEY `relation_type_6` (`relation_type`),
  UNIQUE KEY `relation_type_7` (`relation_type`),
  UNIQUE KEY `relation_type_8` (`relation_type`),
  UNIQUE KEY `relation_type_9` (`relation_type`),
  UNIQUE KEY `relation_type_10` (`relation_type`),
  UNIQUE KEY `relation_type_11` (`relation_type`),
  UNIQUE KEY `relation_type_12` (`relation_type`),
  UNIQUE KEY `relation_type_13` (`relation_type`),
  UNIQUE KEY `relation_type_14` (`relation_type`),
  UNIQUE KEY `relation_type_15` (`relation_type`),
  UNIQUE KEY `relation_type_16` (`relation_type`),
  UNIQUE KEY `relation_type_17` (`relation_type`),
  UNIQUE KEY `relation_type_18` (`relation_type`),
  UNIQUE KEY `relation_type_19` (`relation_type`),
  UNIQUE KEY `relation_type_20` (`relation_type`),
  UNIQUE KEY `relation_type_21` (`relation_type`),
  UNIQUE KEY `relation_type_22` (`relation_type`),
  UNIQUE KEY `relation_type_23` (`relation_type`),
  UNIQUE KEY `relation_type_24` (`relation_type`),
  UNIQUE KEY `relation_type_25` (`relation_type`),
  UNIQUE KEY `relation_type_26` (`relation_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relationtypes`
--

LOCK TABLES `relationtypes` WRITE;
/*!40000 ALTER TABLE `relationtypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `relationtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reports` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `type` enum('attendance','academic','behavioral','financial','general') NOT NULL,
  `childId` int(11) DEFAULT NULL,
  `classId` int(11) DEFAULT NULL,
  `generatedBy` int(11) NOT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `periodStartDate` datetime DEFAULT NULL,
  `periodEndDate` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `childId` (`childId`),
  KEY `classId` (`classId`),
  KEY `generatedBy` (`generatedBy`),
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_10` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_11` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_12` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_13` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_14` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_15` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_16` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_17` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_18` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_19` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_20` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_21` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_22` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_23` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_24` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_25` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_26` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_27` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_28` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_29` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_30` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_31` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_32` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_33` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_34` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_35` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_36` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_37` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_38` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_39` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_4` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_40` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_41` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_42` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_43` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_44` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_45` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_46` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_47` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_48` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_49` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_5` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_50` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_51` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_52` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_53` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_54` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_55` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_56` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_57` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_58` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_59` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_6` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_60` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_61` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_62` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_63` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_64` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_65` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_66` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_67` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_68` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_69` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_7` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_70` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_71` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_72` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_73` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_74` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_75` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_76` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_77` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_78` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_79` FOREIGN KEY (`childId`) REFERENCES `children` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_8` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_80` FOREIGN KEY (`classId`) REFERENCES `classrooms` (`classID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_81` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `reports_ibfk_9` FOREIGN KEY (`generatedBy`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sections`
--

DROP TABLE IF EXISTS `sections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sections` (
  `section_id` int(11) NOT NULL AUTO_INCREMENT,
  `SectionName` varchar(100) NOT NULL,
  `Name_level` varchar(50) NOT NULL,
  `Level` varchar(50) DEFAULT NULL,
  `Capacity` int(11) DEFAULT NULL,
  `classID` int(11) NOT NULL,
  `assigned_teacher_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`section_id`),
  UNIQUE KEY `SectionName` (`SectionName`),
  UNIQUE KEY `Name_level` (`Name_level`),
  UNIQUE KEY `SectionName_2` (`SectionName`),
  UNIQUE KEY `Name_level_2` (`Name_level`),
  UNIQUE KEY `SectionName_3` (`SectionName`),
  UNIQUE KEY `Name_level_3` (`Name_level`),
  UNIQUE KEY `SectionName_4` (`SectionName`),
  UNIQUE KEY `Name_level_4` (`Name_level`),
  UNIQUE KEY `SectionName_5` (`SectionName`),
  UNIQUE KEY `Name_level_5` (`Name_level`),
  UNIQUE KEY `SectionName_6` (`SectionName`),
  UNIQUE KEY `Name_level_6` (`Name_level`),
  UNIQUE KEY `SectionName_7` (`SectionName`),
  UNIQUE KEY `Name_level_7` (`Name_level`),
  UNIQUE KEY `SectionName_8` (`SectionName`),
  UNIQUE KEY `Name_level_8` (`Name_level`),
  UNIQUE KEY `SectionName_9` (`SectionName`),
  UNIQUE KEY `Name_level_9` (`Name_level`),
  UNIQUE KEY `SectionName_10` (`SectionName`),
  UNIQUE KEY `Name_level_10` (`Name_level`),
  UNIQUE KEY `SectionName_11` (`SectionName`),
  UNIQUE KEY `Name_level_11` (`Name_level`),
  UNIQUE KEY `SectionName_12` (`SectionName`),
  UNIQUE KEY `Name_level_12` (`Name_level`),
  UNIQUE KEY `SectionName_13` (`SectionName`),
  UNIQUE KEY `Name_level_13` (`Name_level`),
  UNIQUE KEY `SectionName_14` (`SectionName`),
  UNIQUE KEY `Name_level_14` (`Name_level`),
  UNIQUE KEY `SectionName_15` (`SectionName`),
  UNIQUE KEY `Name_level_15` (`Name_level`),
  UNIQUE KEY `SectionName_16` (`SectionName`),
  UNIQUE KEY `Name_level_16` (`Name_level`),
  UNIQUE KEY `SectionName_17` (`SectionName`),
  UNIQUE KEY `Name_level_17` (`Name_level`),
  UNIQUE KEY `SectionName_18` (`SectionName`),
  UNIQUE KEY `Name_level_18` (`Name_level`),
  UNIQUE KEY `SectionName_19` (`SectionName`),
  UNIQUE KEY `Name_level_19` (`Name_level`),
  UNIQUE KEY `SectionName_20` (`SectionName`),
  UNIQUE KEY `Name_level_20` (`Name_level`),
  UNIQUE KEY `SectionName_21` (`SectionName`),
  UNIQUE KEY `Name_level_21` (`Name_level`),
  UNIQUE KEY `SectionName_22` (`SectionName`),
  UNIQUE KEY `Name_level_22` (`Name_level`),
  UNIQUE KEY `SectionName_23` (`SectionName`),
  UNIQUE KEY `Name_level_23` (`Name_level`),
  UNIQUE KEY `SectionName_24` (`SectionName`),
  UNIQUE KEY `Name_level_24` (`Name_level`),
  UNIQUE KEY `SectionName_25` (`SectionName`),
  UNIQUE KEY `Name_level_25` (`Name_level`),
  UNIQUE KEY `SectionName_26` (`SectionName`),
  UNIQUE KEY `Name_level_26` (`Name_level`),
  UNIQUE KEY `SectionName_27` (`SectionName`),
  UNIQUE KEY `Name_level_27` (`Name_level`),
  UNIQUE KEY `SectionName_28` (`SectionName`),
  UNIQUE KEY `Name_level_28` (`Name_level`),
  KEY `classID` (`classID`),
  KEY `assigned_teacher_id` (`assigned_teacher_id`),
  CONSTRAINT `sections_ibfk_1` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_10` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_11` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_12` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_13` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_14` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_15` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_16` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_17` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_18` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_19` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_2` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_20` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_21` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_22` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_23` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_24` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_25` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_26` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_27` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_28` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_29` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_3` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_30` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_31` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_32` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_33` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_34` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_35` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_36` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_37` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_38` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_39` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_4` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_40` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_41` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_42` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_43` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_44` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_45` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_46` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_47` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_48` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_49` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_5` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_50` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_51` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_52` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_53` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_54` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_55` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_56` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_6` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_7` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_8` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `sections_ibfk_9` FOREIGN KEY (`classID`) REFERENCES `classrooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sections`
--

LOCK TABLES `sections` WRITE;
/*!40000 ALTER TABLE `sections` DISABLE KEYS */;
/*!40000 ALTER TABLE `sections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subjects` (
  `SubjectID` int(11) NOT NULL AUTO_INCREMENT,
  `Subject_name` varchar(100) NOT NULL,
  `level` varchar(50) NOT NULL,
  `semester` varchar(50) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`SubjectID`),
  UNIQUE KEY `subjects__subject_name_level_semester` (`Subject_name`,`level`,`semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacherattendances`
--

DROP TABLE IF EXISTS `teacherattendances`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teacherattendances` (
  `AttendanceID` int(11) NOT NULL AUTO_INCREMENT,
  `Date` date NOT NULL,
  `Status` enum('Present','Absent','Late','Excused') NOT NULL,
  `Excuse` text DEFAULT NULL,
  `ExcuseAttachment` varchar(255) DEFAULT NULL,
  `TeacherID` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`AttendanceID`),
  KEY `TeacherID` (`TeacherID`),
  CONSTRAINT `teacherattendances_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_10` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_11` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_12` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_13` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_14` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_15` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_16` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_17` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_18` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_19` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_2` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_20` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_21` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_22` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_23` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_24` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_25` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_26` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_27` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_28` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_3` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_4` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_5` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_6` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_7` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_8` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `teacherattendances_ibfk_9` FOREIGN KEY (`TeacherID`) REFERENCES `teachers` (`PersonID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacherattendances`
--

LOCK TABLES `teacherattendances` WRITE;
/*!40000 ALTER TABLE `teacherattendances` DISABLE KEYS */;
INSERT INTO `teacherattendances` VALUES (1,'2026-09-14','Present','',NULL,2,'2026-09-14 09:49:19','2026-09-14 09:49:19'),(2,'2026-09-14','Present','',NULL,4,'2026-09-14 09:49:38','2026-09-14 09:49:38'),(3,'2026-09-14','Present','',NULL,6,'2026-09-14 09:50:07','2026-09-14 09:50:07'),(4,'2026-09-14','Present','',NULL,8,'2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `teacherattendances` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teachers`
--

DROP TABLE IF EXISTS `teachers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `teachers` (
  `PersonID` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `F_name` varchar(50) NOT NULL,
  `S_name` varchar(50) DEFAULT NULL,
  `Th_name` varchar(50) DEFAULT NULL,
  `L_name` varchar(50) NOT NULL,
  `T_Number` varchar(30) DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `years_of_experience` int(11) DEFAULT NULL,
  `Role` varchar(50) NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`PersonID`),
  UNIQUE KEY `userId` (`userId`),
  KEY `subject_id` (`subject_id`),
  CONSTRAINT `teachers_ibfk_1` FOREIGN KEY (`PersonID`) REFERENCES `persons` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_10` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_11` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_12` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_13` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_14` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_15` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_16` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_17` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_18` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_19` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_20` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_21` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_22` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_23` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_24` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_25` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_26` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_27` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_28` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_29` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_3` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_30` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_31` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_32` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_33` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_34` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_35` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_36` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_37` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_38` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_39` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_4` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_40` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_41` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_42` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_43` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_44` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_45` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_46` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_47` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_48` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_49` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_5` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_50` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_51` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_52` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_53` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_54` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_55` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_56` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_57` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_6` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_7` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_8` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `teachers_ibfk_9` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teachers`
--

LOCK TABLES `teachers` WRITE;
/*!40000 ALTER TABLE `teachers` DISABLE KEYS */;
INSERT INTO `teachers` VALUES (2,NULL,'أحمد','محمود','','المعلم','TEA-145','لغة عربية',1,'معلم/ة',NULL,'2026-09-14 09:49:19','2026-09-14 09:49:19'),(4,NULL,'أحمد','محمود','','المعلم','TEA-6851','لغة عربية',1,'معلم/ة',NULL,'2026-09-14 09:49:38','2026-09-14 09:49:38'),(6,NULL,'أحمد','محمود','','المعلم','TEA-1677','لغة عربية',1,'معلم/ة',NULL,'2026-09-14 09:50:07','2026-09-14 09:50:07'),(8,NULL,'أحمد','محمود','','المعلم','TEA-2282','لغة عربية',1,'معلم/ة',NULL,'2026-09-14 09:50:24','2026-09-14 09:50:24');
/*!40000 ALTER TABLE `teachers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `roleType` enum('admin','teacher','parent') DEFAULT 'parent',
  `fullName` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username_2` (`username`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `username_3` (`username`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `username_4` (`username`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `username_5` (`username`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `username_6` (`username`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `username_7` (`username`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `username_8` (`username`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `username_9` (`username`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `username_10` (`username`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `username_11` (`username`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `username_12` (`username`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `username_13` (`username`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `username_14` (`username`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `username_15` (`username`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `username_16` (`username`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `username_17` (`username`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `username_18` (`username`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `username_19` (`username`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `username_20` (`username`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `username_21` (`username`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `username_22` (`username`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `username_23` (`username`),
  UNIQUE KEY `email_23` (`email`),
  UNIQUE KEY `username_24` (`username`),
  UNIQUE KEY `email_24` (`email`),
  UNIQUE KEY `username_25` (`username`),
  UNIQUE KEY `email_25` (`email`),
  UNIQUE KEY `username_26` (`username`),
  UNIQUE KEY `email_26` (`email`),
  UNIQUE KEY `username_27` (`username`),
  UNIQUE KEY `email_27` (`email`),
  UNIQUE KEY `username_28` (`username`),
  UNIQUE KEY `email_28` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','admin@aliaitihad.edu','$2a$10$83FYbonvhLh2qiV.zDpGG.7g8fHS.Ww5rsbOuFyMhfu1Kv3tNTmRq','admin','مدير النظام','0590000000',NULL,'2026-09-14 09:24:50','2026-10-01 10:34:05');
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

-- Dump completed on 2026-10-04 16:08:00
