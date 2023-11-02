/*
  Warnings:

  - A unique constraint covering the columns `[period_id,date]` on the table `daily_notes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `period_id` to the `daily_notes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `daily_notes` ADD COLUMN `period_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `daily_notes_period_id_date_key` ON `daily_notes`(`period_id`, `date`);

-- AddForeignKey
ALTER TABLE `daily_notes` ADD CONSTRAINT `daily_notes_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `periods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
