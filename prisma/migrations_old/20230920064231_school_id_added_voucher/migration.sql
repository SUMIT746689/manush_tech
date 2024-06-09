-- AlterTable
ALTER TABLE `vouchers` ADD COLUMN `school_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
