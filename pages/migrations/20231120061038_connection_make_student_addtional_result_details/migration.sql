-- AddForeignKey
ALTER TABLE `student_addtional_result_details` ADD CONSTRAINT `student_addtional_result_details_exam_addtional_mark_id_fkey` FOREIGN KEY (`exam_addtional_mark_id`) REFERENCES `exam_addtional_marks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
