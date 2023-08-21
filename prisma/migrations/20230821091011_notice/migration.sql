/*
  Warnings:

  - You are about to drop the column `description` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `photo_url` on the `notices` table. All the data in the column will be lost.
  - You are about to drop the column `latest_news` on the `website_uis` table. All the data in the column will be lost.
  - Added the required column `file_url` to the `notices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notices` DROP COLUMN `description`,
    DROP COLUMN `photo_url`,
    ADD COLUMN `file_url` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `website_uis` DROP COLUMN `latest_news`;
