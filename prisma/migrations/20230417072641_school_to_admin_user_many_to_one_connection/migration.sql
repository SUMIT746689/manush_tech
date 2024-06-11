/*
  Warnings:

  - You are about to drop the column `admin_id` on the `schools` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `schools` DROP FOREIGN KEY `schools_admin_id_fkey`;

-- AlterTable
ALTER TABLE `schools` DROP COLUMN `admin_id`;
