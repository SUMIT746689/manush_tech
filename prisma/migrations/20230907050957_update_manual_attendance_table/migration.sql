-- AlterTable
ALTER TABLE `tbl_manual_attendace_queue` ADD COLUMN `class_id` INTEGER NULL,
    ADD COLUMN `section_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `tbl_manual_attendace_queue` ADD CONSTRAINT `tbl_manual_attendace_queue_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_attendace_queue` ADD CONSTRAINT `tbl_manual_attendace_queue_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
