-- AlterTable
ALTER TABLE `exam_details` ADD COLUMN `exam_room` INTEGER NULL;

-- AlterTable
ALTER TABLE `periods` ADD COLUMN `subject_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_details` ADD CONSTRAINT `exam_details_exam_room_fkey` FOREIGN KEY (`exam_room`) REFERENCES `rooms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
