/*
  Warnings:

  - A unique constraint covering the columns `[tracking_number,school_id]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `tracking_number` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `transactions_tracking_number_school_id_key` ON `transactions`(`tracking_number`, `school_id`);
