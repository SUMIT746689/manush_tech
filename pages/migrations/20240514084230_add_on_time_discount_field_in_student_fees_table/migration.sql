/*
  Warnings:

  - You are about to drop the column `curr_discount` on the `student_fees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `student_fees` DROP COLUMN `curr_discount`,
    ADD COLUMN `on_time_discount` INTEGER NULL;
