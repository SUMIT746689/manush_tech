-- AddForeignKey
ALTER TABLE `grade_systems` ADD CONSTRAINT `grade_systems_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
