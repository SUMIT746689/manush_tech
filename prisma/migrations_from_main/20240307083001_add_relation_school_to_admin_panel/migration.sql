-- AlterTable
ALTER TABLE `schools` ADD COLUMN `admin_panel_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_admin_panel_id_fkey` FOREIGN KEY (`admin_panel_id`) REFERENCES `admin_panels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
