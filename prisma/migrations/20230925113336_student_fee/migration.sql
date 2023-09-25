-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `account_id` INTEGER NULL,
    ADD COLUMN `payment_method_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
