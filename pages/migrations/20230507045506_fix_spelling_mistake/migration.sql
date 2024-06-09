/*
  Warnings:

  - You are about to drop the column `mather_name` on the `student_informations` table. All the data in the column will be lost.
  - You are about to drop the column `mather_phone` on the `student_informations` table. All the data in the column will be lost.
  - You are about to drop the column `mather_photo` on the `student_informations` table. All the data in the column will be lost.
  - You are about to drop the column `mather_profession` on the `student_informations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `student_informations` DROP COLUMN `mather_name`,
    DROP COLUMN `mather_phone`,
    DROP COLUMN `mather_photo`,
    DROP COLUMN `mather_profession`,
    ADD COLUMN `mother_name` VARCHAR(191) NULL,
    ADD COLUMN `mother_phone` VARCHAR(191) NULL,
    ADD COLUMN `mother_photo` VARCHAR(191) NULL,
    ADD COLUMN `mother_profession` VARCHAR(191) NULL;
