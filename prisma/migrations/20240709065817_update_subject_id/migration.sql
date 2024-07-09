-- AddForeignKey
ALTER TABLE `student_fee_wise_teacher_pays` ADD CONSTRAINT `student_fee_wise_teacher_pays_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
