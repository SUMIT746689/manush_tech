/*
  Warnings:

  - A unique constraint covering the columns `[school_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `subscriptions` DROP FOREIGN KEY `subscriptions_package_id_fkey`;

-- DropForeignKey
ALTER TABLE `subscriptions` DROP FOREIGN KEY `subscriptions_school_id_fkey`;

-- DropIndex
DROP INDEX `subscriptions_school_id_package_id_key` ON `subscriptions`;

-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_school_id_key` ON `subscriptions`(`school_id`);
