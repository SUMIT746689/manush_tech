-- DropForeignKey
ALTER TABLE `fees` DROP FOREIGN KEY `fees_subject_id_fkey`;

-- AlterTable
ALTER TABLE `fees` MODIFY `subject_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
