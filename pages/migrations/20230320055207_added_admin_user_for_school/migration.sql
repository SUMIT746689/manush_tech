/*
  Warnings:

  - A unique constraint covering the columns `[admin_id]` on the table `schools` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `admin_id` to the `schools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `schools` ADD COLUMN `admin_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `schools_admin_id_key` ON `schools`(`admin_id`);

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_admin_id_fkey` FOREIGN KEY (`admin_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
