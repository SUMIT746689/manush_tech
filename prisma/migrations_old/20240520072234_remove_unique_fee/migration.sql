-- DropIndex
DROP INDEX `fees_fees_month_fees_head_id_class_id_academic_year_id_key` ON `fees`;

-- AlterTable
ALTER TABLE `fees` ADD COLUMN `deleted_at` DATETIME(3) NULL;
