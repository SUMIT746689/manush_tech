-- DropForeignKey
ALTER TABLE `student_fees` DROP FOREIGN KEY `student_fees_collected_by_fkey`;

-- AlterTable
ALTER TABLE `student_fees` MODIFY `collected_by` INTEGER NULL,
    MODIFY `payment_method` ENUM('cash', 'online', 'pending') NOT NULL;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_collected_by_fkey` FOREIGN KEY (`collected_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
