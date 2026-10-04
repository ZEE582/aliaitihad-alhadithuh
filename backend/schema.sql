-- =====================================================================
-- Kindergarten Database - Schema from ERD
-- (Al Ittihad Modern Kindergarten)
-- Creates database + all tables + relationships
-- Requires: MySQL 5.7+ / 8.x
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `kindergarten_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `kindergarten_db`;

-- ---------------------------------------------------------------------
-- 1. Persons (supertype: "is a" relationship, holds shared identity)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Persons` (
  `PersonID`   INT          NOT NULL AUTO_INCREMENT,
  `Name`       VARCHAR(255) NOT NULL,
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`PersonID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 1b. Users (legacy authentication, needed by Teachers/Guardians/etc.)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Users` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `username`   VARCHAR(255) NOT NULL,
  `email`      VARCHAR(255) NOT NULL,
  `password`   VARCHAR(255) NOT NULL,
  `roleType`   ENUM('admin','teacher','parent') NOT NULL DEFAULT 'parent',
  `fullName`   VARCHAR(255) NOT NULL,
  `phone`      VARCHAR(255) NULL,
  `avatar`     VARCHAR(255) NULL,
  `createdAt`  DATETIME NOT NULL,
  `updatedAt`  DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_user_username` (`username`),
  UNIQUE KEY `uq_user_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 2. ClassRooms
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassRooms` (
  `classID`    INT          NOT NULL AUTO_INCREMENT,
  `className`  VARCHAR(100) NOT NULL,
  `createdAt`  DATETIME     NOT NULL,
  `updatedAt`  DATETIME     NOT NULL,
  PRIMARY KEY (`classID`),
  UNIQUE KEY `uq_className` (`className`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 3. Subjects (S_info is just a summary of level+semester+subject_name)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Subjects` (
  `SubjectID`    INT          NOT NULL AUTO_INCREMENT,
  `Subject_name` VARCHAR(100) NOT NULL,
  `level`        VARCHAR(50)  NOT NULL,
  `semester`     VARCHAR(50)  NOT NULL,
  `createdAt`    DATETIME     NOT NULL,
  `updatedAt`    DATETIME     NOT NULL,
  PRIMARY KEY (`SubjectID`),
  UNIQUE KEY `uq_subject_name_level_semester` (`Subject_name`, `level`, `semester`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 4. Teachers (PersonID is PK + FK to Persons)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Teachers` (
  `PersonID`            INT          NOT NULL,
  `userId`              INT          NULL,
  `F_name`              VARCHAR(50)  NOT NULL,
  `S_name`              VARCHAR(50)  NULL,
  `Th_name`             VARCHAR(50)  NULL,
  `L_name`              VARCHAR(50)  NOT NULL,
  `T_Number`            VARCHAR(30)  NULL,
  `specialty`           VARCHAR(100) NULL,
  `years_of_experience` INT          NULL,
  `Role`                VARCHAR(50)  NOT NULL,
  `subject_id`          INT          NULL,
  `createdAt`           DATETIME     NOT NULL,
  `updatedAt`           DATETIME     NOT NULL,
  PRIMARY KEY (`PersonID`),
  UNIQUE KEY `uq_teacher_user` (`userId`),
  KEY `idx_teacher_subject` (`subject_id`),
  CONSTRAINT `fk_teacher_person`    FOREIGN KEY (`PersonID`)   REFERENCES `Persons`  (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_user`      FOREIGN KEY (`userId`)     REFERENCES `Users`    (`id`)       ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_teacher_subject`   FOREIGN KEY (`subject_id`) REFERENCES `Subjects` (`SubjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 5. Sections (belongs_to ClassRoom)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Sections` (
  `section_id`          INT          NOT NULL AUTO_INCREMENT,
  `SectionName`         VARCHAR(100) NOT NULL,
  `Name_level`          VARCHAR(50)  NOT NULL,
  `Level`               VARCHAR(50)  NULL,
  `Capacity`            INT          NULL,
  `classID`             INT          NOT NULL,
  `assigned_teacher_id` INT          NULL,
  `createdAt`           DATETIME     NOT NULL,
  `updatedAt`           DATETIME     NOT NULL,
  PRIMARY KEY (`section_id`),
  UNIQUE KEY `uq_section_name` (`SectionName`),
  UNIQUE KEY `uq_name_level` (`Name_level`),
  KEY `idx_section_class` (`classID`),
  KEY `idx_section_teacher` (`assigned_teacher_id`),
  CONSTRAINT `fk_section_class`   FOREIGN KEY (`classID`)             REFERENCES `ClassRooms` (`classID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_section_teacher` FOREIGN KEY (`assigned_teacher_id`) REFERENCES `Teachers`  (`PersonID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 6. Children (PersonID is PK + FK to Persons, "belongs_to" Section)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Children` (
  `PersonID`         INT          NOT NULL,
  `F_name`           VARCHAR(50)  NOT NULL,
  `S_name`           VARCHAR(50)  NULL,
  `Th_name`          VARCHAR(50)  NULL,
  `L_name`           VARCHAR(50)  NOT NULL,
  `gender`           ENUM('Male','Female','Other') NOT NULL,
  `birth_date`       DATE         NOT NULL,
  `birthplace`       VARCHAR(100) NULL,
  `address`          VARCHAR(255) NULL,
  `education_stage`  VARCHAR(50)  NULL,
  `num_of_brothers`  INT          NOT NULL DEFAULT 0,
  `status_of_parents` VARCHAR(50) NULL,
  `child_order`      INT          NULL,
  `classID`          INT          NULL,
  `section_id`       INT          NULL,
  `createdAt`        DATETIME     NOT NULL,
  `updatedAt`        DATETIME     NOT NULL,
  PRIMARY KEY (`PersonID`),
  KEY `idx_child_class` (`classID`),
  KEY `idx_child_section` (`section_id`),
  CONSTRAINT `fk_child_person`  FOREIGN KEY (`PersonID`)   REFERENCES `Persons`  (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_child_class`   FOREIGN KEY (`classID`)    REFERENCES `ClassRooms` (`classID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_child_section` FOREIGN KEY (`section_id`) REFERENCES `Sections`  (`section_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 7. Guardians (independent entity with its own GID)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Guardians` (
  `GID`              INT          NOT NULL AUTO_INCREMENT,
  `userId`           INT          NULL,
  `G_F_name`         VARCHAR(50)  NOT NULL,
  `G_S_name`         VARCHAR(50)  NULL,
  `G_Th_name`        VARCHAR(50)  NULL,
  `G_L_name`         VARCHAR(50)  NOT NULL,
  `G_phone`          VARCHAR(20)  NULL,
  `W_phone`          VARCHAR(20)  NULL,
  `emergency_number` VARCHAR(20)  NULL,
  `work`             VARCHAR(100) NULL,
  `W_place`          VARCHAR(100) NULL,
  `educational_level` VARCHAR(50) NULL,
  `createdAt`        DATETIME     NOT NULL,
  `updatedAt`        DATETIME     NOT NULL,
  PRIMARY KEY (`GID`),
  UNIQUE KEY `uq_guardian_user` (`userId`),
  CONSTRAINT `fk_guardian_user` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 8. RelationTypes (used by Child_Guardians M:N)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `RelationTypes` (
  `RelationTypeID` INT          NOT NULL AUTO_INCREMENT,
  `relation_type`  VARCHAR(50)  NOT NULL,
  `createdAt`      DATETIME     NOT NULL,
  `updatedAt`      DATETIME     NOT NULL,
  PRIMARY KEY (`RelationTypeID`),
  UNIQUE KEY `uq_relation_type` (`relation_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 9. Health_Medicines (child's medical file)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Health_Medicines` (
  `CH_M_ID`      INT NOT NULL AUTO_INCREMENT,
  `Diseases`     TEXT NULL,
  `vaccinations` TEXT NULL,
  `allergies`    TEXT NULL,
  `createdAt`    DATETIME NOT NULL,
  `updatedAt`    DATETIME NOT NULL,
  PRIMARY KEY (`CH_M_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 10. Children<->Guardians (M:N junction with relation type)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Child_Guardians` (
  `child_PersonID` INT NOT NULL,
  `GID`            INT NOT NULL,
  `RelationTypeID` INT NOT NULL,
  `createdAt`      DATETIME NOT NULL,
  `updatedAt`      DATETIME NOT NULL,
  PRIMARY KEY (`child_PersonID`, `GID`, `RelationTypeID`),
  KEY `idx_cg_guardian` (`GID`),
  KEY `idx_cg_reltype` (`RelationTypeID`),
  CONSTRAINT `fk_cg_child`      FOREIGN KEY (`child_PersonID`) REFERENCES `Children`     (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cg_guardian`   FOREIGN KEY (`GID`)            REFERENCES `Guardians`   (`GID`)      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cg_reltype`    FOREIGN KEY (`RelationTypeID`) REFERENCES `RelationTypes`(`RelationTypeID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 11. Children<->Health_Medicines (HasH_R)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Child_Health_Medicines` (
  `child_PersonID` INT NOT NULL,
  `CH_M_ID`        INT NOT NULL,
  `createdAt`      DATETIME NOT NULL,
  `updatedAt`      DATETIME NOT NULL,
  PRIMARY KEY (`child_PersonID`),
  UNIQUE KEY `uq_chm_health` (`CH_M_ID`),
  CONSTRAINT `fk_chm_child`   FOREIGN KEY (`child_PersonID`) REFERENCES `Children`        (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_chm_health`  FOREIGN KEY (`CH_M_ID`)        REFERENCES `Health_Medicines` (`CH_M_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 12. classSessions (hosted by ClassRoom, has_sessions Section, taught_in Subject)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `classSessions` (
  `SessionID`           INT          NOT NULL AUTO_INCREMENT,
  `Date`                DATE         NOT NULL,
  `day`                 VARCHAR(20)  NOT NULL,
  `Period`              VARCHAR(50)  NOT NULL,
  `Study_class_number`  VARCHAR(50)  NULL,
  `SubjectID`           INT          NOT NULL,
  `section_id`          INT          NULL,
  `createdAt`           DATETIME     NOT NULL,
  `updatedAt`           DATETIME     NOT NULL,
  PRIMARY KEY (`SessionID`),
  KEY `idx_session_subject` (`SubjectID`),
  KEY `idx_session_section` (`section_id`),
  CONSTRAINT `fk_session_subject` FOREIGN KEY (`SubjectID`)   REFERENCES `Subjects` (`SubjectID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_session_section` FOREIGN KEY (`section_id`)  REFERENCES `Sections` (`section_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 13. ClassRooms<->classSessions (hosts junction)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ClassRoom_ClassSessions` (
  `classID`   INT NOT NULL,
  `SessionID` INT NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  PRIMARY KEY (`classID`, `SessionID`),
  KEY `idx_crcs_session` (`SessionID`),
  CONSTRAINT `fk_crcs_class`   FOREIGN KEY (`classID`)   REFERENCES `ClassRooms` (`classID`)   ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_crcs_session` FOREIGN KEY (`SessionID`) REFERENCES `classSessions`(`SessionID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 14. Attendances (child attendance, recorded_in ClassRoom)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Attendances` (
  `AttendanceID`   INT NOT NULL AUTO_INCREMENT,
  `AttendanceDate` DATE NOT NULL,
  `Status`         ENUM('Present','Absent','Late','Excused') NOT NULL,
  `Reason`         TEXT NULL,
  `child_PersonID` INT NOT NULL,
  `classID`        INT NOT NULL,
  `createdAt`      DATETIME NOT NULL,
  `updatedAt`      DATETIME NOT NULL,
  PRIMARY KEY (`AttendanceID`),
  KEY `idx_att_child` (`child_PersonID`),
  KEY `idx_att_class` (`classID`),
  CONSTRAINT `fk_att_child`  FOREIGN KEY (`child_PersonID`) REFERENCES `Children`   (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_att_class`  FOREIGN KEY (`classID`)        REFERENCES `ClassRooms` (`classID`)  ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 15. TeacherAttendances (teacher has attendance)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `TeacherAttendances` (
  `AttendanceID`    INT NOT NULL AUTO_INCREMENT,
  `Date`            DATE NOT NULL,
  `Status`          ENUM('Present','Absent','Late','Excused') NOT NULL,
  `Excuse`          TEXT NULL,
  `ExcuseAttachment` VARCHAR(255) NULL,
  `TeacherID`       INT NOT NULL,
  `createdAt`       DATETIME NOT NULL,
  `updatedAt`       DATETIME NOT NULL,
  PRIMARY KEY (`AttendanceID`),
  KEY `idx_tatt_teacher` (`TeacherID`),
  CONSTRAINT `fk_tatt_teacher` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 16. Notes (sent/received between any Persons)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Notes` (
  `NoteID`       INT NOT NULL AUTO_INCREMENT,
  `NoteDate`     DATETIME NOT NULL,
  `NoteCategory` VARCHAR(50) NOT NULL,
  `NoteText`     TEXT NOT NULL,
  `SenderID`     INT NOT NULL,
  `ReceiverID`   INT NOT NULL,
  `createdAt`    DATETIME NOT NULL,
  `updatedAt`    DATETIME NOT NULL,
  PRIMARY KEY (`NoteID`),
  KEY `idx_note_sender` (`SenderID`),
  KEY `idx_note_receiver` (`ReceiverID`),
  CONSTRAINT `fk_note_sender`   FOREIGN KEY (`SenderID`)   REFERENCES `Persons` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_note_receiver` FOREIGN KEY (`ReceiverID`) REFERENCES `Persons` (`PersonID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 17. Messages (legacy messaging)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Messages` (
  `id`         INT NOT NULL AUTO_INCREMENT,
  `senderId`   INT NOT NULL,
  `receiverId` INT NOT NULL,
  `subject`    VARCHAR(255) NULL,
  `content`    TEXT NOT NULL,
  `isRead`     TINYINT(1) NOT NULL DEFAULT 0,
  `readAt`     DATETIME NULL,
  `replyTo`    INT NULL,
  `attachments` JSON NULL,
  `createdAt`  DATETIME NOT NULL,
  `updatedAt`  DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_msg_sender` (`senderId`),
  KEY `idx_msg_receiver` (`receiverId`),
  CONSTRAINT `fk_msg_sender`   FOREIGN KEY (`senderId`)   REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_msg_receiver` FOREIGN KEY (`receiverId`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- 19. Reports (legacy reporting)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Reports` (
  `id`             INT NOT NULL AUTO_INCREMENT,
  `title`          VARCHAR(255) NOT NULL,
  `type`           ENUM('attendance','academic','behavioral','financial','general') NOT NULL,
  `childId`        INT NULL,
  `classId`        INT NULL,
  `generatedBy`    INT NOT NULL,
  `data`           JSON NULL,
  `periodStartDate` DATETIME NULL,
  `periodEndDate`  DATETIME NULL,
  `createdAt`      DATETIME NOT NULL,
  `updatedAt`      DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_report_child` (`childId`),
  KEY `idx_report_class` (`classId`),
  KEY `idx_report_generator` (`generatedBy`),
  CONSTRAINT `fk_report_child`     FOREIGN KEY (`childId`)     REFERENCES `Children`   (`PersonID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_report_class`     FOREIGN KEY (`classId`)     REFERENCES `ClassRooms` (`classID`)  ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_report_generator` FOREIGN KEY (`generatedBy`) REFERENCES `Users`      (`id`)       ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Order of creation matters: Users/Persons/ClassRooms/Subjects first, then
-- Teachers, Sections, Children, Guardians..., then junctions and log tables.
-- The script defines Users right after Persons so foreign keys resolve.