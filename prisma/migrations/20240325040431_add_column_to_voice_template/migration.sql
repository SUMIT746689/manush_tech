/*
  Warnings:

  - Added the required column `voice_duration` to the `voice_templates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `voice_templates` ADD COLUMN `voice_duration` INTEGER NOT NULL;
