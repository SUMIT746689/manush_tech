/*
  Warnings:

  - Added the required column `group_id` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `students` ADD COLUMN `group_id` INTEGER;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
