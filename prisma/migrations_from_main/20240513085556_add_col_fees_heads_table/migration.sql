/*
  Warnings:

  - Added the required column `school_id` to the `fees_head` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `fees_head` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `fees_head` ADD CONSTRAINT `fees_head_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
