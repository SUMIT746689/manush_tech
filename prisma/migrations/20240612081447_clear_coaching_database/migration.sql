-- DropForeignKey
ALTER TABLE `fees` DROP FOREIGN KEY `fees_subject_id_fkey`;

-- AlterTable
ALTER TABLE `fees` ADD COLUMN `fees_type` VARCHAR(191) NULL,
    MODIFY `subject_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
