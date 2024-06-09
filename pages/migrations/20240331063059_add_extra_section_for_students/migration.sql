-- AlterTable
ALTER TABLE `students` ADD COLUMN `extra_section_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_extra_section_id_fkey` FOREIGN KEY (`extra_section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
