/*
  Warnings:

  - Added the required column `latest_news` to the `website_uis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `website_uis` ADD COLUMN `latest_news` JSON NOT NULL;
