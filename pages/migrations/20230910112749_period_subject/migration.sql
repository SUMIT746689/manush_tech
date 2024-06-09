/*
  Warnings:

  - Made the column `subject_id` on table `periods` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `periods` DROP FOREIGN KEY `periods_subject_id_fkey`;

-- AlterTable
ALTER TABLE `periods` MODIFY `subject_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
