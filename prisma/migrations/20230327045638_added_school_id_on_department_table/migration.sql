/*
  Warnings:

  - Added the required column `school_id` to the `departments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `departments` ADD COLUMN `school_id` INTEGER NOT NULL;
