/*
  Warnings:

  - You are about to drop the column `session_id` on the `fees` table. All the data in the column will be lost.
  - You are about to drop the column `admission_date` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `admission_no` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `admission_status` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `blood_group` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `date_of_birth` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `father_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `father_phone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `father_photo` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `father_profession` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `first_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `mather_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `mather_phone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `mather_photo` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `mather_profession` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `middle_name` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `national_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `previous_school` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `registration_no` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `religion` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `roll_no` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `student_admission_status` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `student_permanent_address` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `sessions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_statuses` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `academic_year_id` to the `fees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `academic_year_id` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_registration_no` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_roll_no` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_information_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `fees` DROP FOREIGN KEY `fees_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_statuses` DROP FOREIGN KEY `student_statuses_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_statuses` DROP FOREIGN KEY `student_statuses_session_id_fkey`;

-- DropForeignKey
ALTER TABLE `student_statuses` DROP FOREIGN KEY `student_statuses_student_id_fkey`;

-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `students_user_id_fkey`;

-- AlterTable
ALTER TABLE `fees` DROP COLUMN `session_id`,
    ADD COLUMN `academic_year_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `students` DROP COLUMN `admission_date`,
    DROP COLUMN `admission_no`,
    DROP COLUMN `admission_status`,
    DROP COLUMN `blood_group`,
    DROP COLUMN `date_of_birth`,
    DROP COLUMN `email`,
    DROP COLUMN `father_name`,
    DROP COLUMN `father_phone`,
    DROP COLUMN `father_photo`,
    DROP COLUMN `father_profession`,
    DROP COLUMN `first_name`,
    DROP COLUMN `gender`,
    DROP COLUMN `last_name`,
    DROP COLUMN `mather_name`,
    DROP COLUMN `mather_phone`,
    DROP COLUMN `mather_photo`,
    DROP COLUMN `mather_profession`,
    DROP COLUMN `middle_name`,
    DROP COLUMN `national_id`,
    DROP COLUMN `phone`,
    DROP COLUMN `previous_school`,
    DROP COLUMN `registration_no`,
    DROP COLUMN `religion`,
    DROP COLUMN `roll_no`,
    DROP COLUMN `school_id`,
    DROP COLUMN `student_admission_status`,
    DROP COLUMN `student_permanent_address`,
    DROP COLUMN `user_id`,
    ADD COLUMN `academic_year_id` INTEGER NOT NULL,
    ADD COLUMN `class_registration_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `class_roll_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `student_information_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `sessions`;

-- DropTable
DROP TABLE `student_statuses`;

-- CreateTable
CREATE TABLE `student_informations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `school_id` INTEGER NOT NULL,
    `admission_no` VARCHAR(191) NOT NULL,
    `admission_date` DATETIME(3) NOT NULL,
    `admission_status` ENUM('waiting', 'approved', 'declined') NOT NULL DEFAULT 'waiting',
    `date_of_birth` DATE NOT NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `blood_group` VARCHAR(20) NULL,
    `religion` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `student_admission_status` VARCHAR(191) NULL,
    `father_name` VARCHAR(191) NULL,
    `father_phone` VARCHAR(191) NULL,
    `father_profession` VARCHAR(191) NULL,
    `father_photo` VARCHAR(191) NULL,
    `mather_name` VARCHAR(191) NULL,
    `mather_phone` VARCHAR(191) NULL,
    `mather_profession` VARCHAR(191) NULL,
    `mather_photo` VARCHAR(191) NULL,
    `student_permanent_address` VARCHAR(191) NULL,
    `previous_school` VARCHAR(191) NULL,

    UNIQUE INDEX `student_informations_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_informations` ADD CONSTRAINT `student_informations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_informations` ADD CONSTRAINT `student_informations_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_student_information_id_fkey` FOREIGN KEY (`student_information_id`) REFERENCES `student_informations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
