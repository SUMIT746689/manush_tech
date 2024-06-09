/*
  Warnings:

  - Added the required column `school_id` to the `std_cls_subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `std_cls_subjects` ADD COLUMN `school_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `std_cls_subjects` ADD CONSTRAINT `std_cls_subjects_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
