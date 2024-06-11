/*
  Warnings:

  - A unique constraint covering the columns `[transaction_id]` on the table `student_fees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `transaction_id` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `student_fees_transaction_id_key` ON `student_fees`(`transaction_id`);

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
