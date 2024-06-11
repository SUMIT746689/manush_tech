-- AlterTable
ALTER TABLE `exams` ADD COLUMN `final_percent` INTEGER NULL;

-- AlterTable
ALTER TABLE `schools` ADD COLUMN `currency` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `student_fees` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
