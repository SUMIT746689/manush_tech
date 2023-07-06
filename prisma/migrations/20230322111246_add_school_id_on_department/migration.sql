/*
  Warnings:

  - Added the required column `school_id` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `departments` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
