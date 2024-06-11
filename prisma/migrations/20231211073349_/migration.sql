/*
  Warnings:

  - Added the required column `data` to the `session_store` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session_store` ADD COLUMN `data` JSON NOT NULL;
