/*
  Warnings:

  - You are about to drop the column `title` on the `packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `packages` DROP COLUMN `title`,
    ADD COLUMN `is_std_cnt_wise` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `student_count` INTEGER NULL;
