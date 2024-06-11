/*
  Warnings:

  - You are about to drop the column `grade_id` on the `student_results` table. All the data in the column will be lost.
  - Added the required column `calculated_grade` to the `student_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `calculated_point` to the `student_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_results` DROP FOREIGN KEY `student_results_grade_id_fkey`;

-- AlterTable
ALTER TABLE `student_results` DROP COLUMN `grade_id`,
    ADD COLUMN `calculated_grade` VARCHAR(191) NOT NULL,
    ADD COLUMN `calculated_point` DOUBLE NOT NULL,
    ADD COLUMN `gradingSystemId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_gradingSystemId_fkey` FOREIGN KEY (`gradingSystemId`) REFERENCES `grade_systems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
