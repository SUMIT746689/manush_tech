-- DropForeignKey
ALTER TABLE `student_fees` DROP FOREIGN KEY `student_fees_fee_id_fkey`;

-- AlterTable
ALTER TABLE `student_fees` MODIFY `fee_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_fee_id_fkey` FOREIGN KEY (`fee_id`) REFERENCES `fees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
