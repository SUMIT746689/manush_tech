/*
  Warnings:

  - Added the required column `admission_date` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `admission_no` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `discount` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registration_no` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roll_no` to the `students` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `joining_date` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `national_id` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `permanent_address` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `present_address` to the `teachers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `resume` to the `teachers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `students` ADD COLUMN `admission_date` DATETIME(3) NOT NULL,
    ADD COLUMN `admission_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `admission_status` ENUM('waiting', 'approved', 'declined') NOT NULL DEFAULT 'waiting',
    ADD COLUMN `blood_group` VARCHAR(20) NULL,
    ADD COLUMN `date_of_birth` DATE NOT NULL,
    ADD COLUMN `discount` DOUBLE NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `father_name` VARCHAR(191) NULL,
    ADD COLUMN `father_phone` VARCHAR(191) NULL,
    ADD COLUMN `father_photo` VARCHAR(191) NULL,
    ADD COLUMN `father_profession` VARCHAR(191) NULL,
    ADD COLUMN `gender` ENUM('male', 'female') NOT NULL,
    ADD COLUMN `guardian_name` VARCHAR(191) NULL,
    ADD COLUMN `guardian_phone` VARCHAR(191) NULL,
    ADD COLUMN `guardian_photo` VARCHAR(191) NULL,
    ADD COLUMN `guardian_profession` VARCHAR(191) NULL,
    ADD COLUMN `mather_name` VARCHAR(191) NULL,
    ADD COLUMN `mather_phone` VARCHAR(191) NULL,
    ADD COLUMN `mather_photo` VARCHAR(191) NULL,
    ADD COLUMN `mather_profession` VARCHAR(191) NULL,
    ADD COLUMN `national_id` VARCHAR(191) NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `previous_school` VARCHAR(191) NULL,
    ADD COLUMN `registration_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `relation_with_guardian` VARCHAR(191) NULL,
    ADD COLUMN `religion` VARCHAR(191) NULL,
    ADD COLUMN `roll_no` VARCHAR(191) NOT NULL,
    ADD COLUMN `student_admission_status` VARCHAR(191) NULL,
    ADD COLUMN `student_permanent_address` VARCHAR(191) NULL,
    ADD COLUMN `student_photo` VARCHAR(191) NULL,
    ADD COLUMN `student_present_address` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `blood_group` VARCHAR(20) NULL,
    ADD COLUMN `date_of_birth` DATE NOT NULL,
    ADD COLUMN `department_id` INTEGER NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `first_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` ENUM('male', 'female') NOT NULL,
    ADD COLUMN `joining_date` DATE NOT NULL,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    ADD COLUMN `middle_name` VARCHAR(191) NULL,
    ADD COLUMN `national_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `permanent_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NULL,
    ADD COLUMN `photo` VARCHAR(191) NULL,
    ADD COLUMN `present_address` VARCHAR(191) NOT NULL,
    ADD COLUMN `religion` VARCHAR(191) NULL,
    ADD COLUMN `resume` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
