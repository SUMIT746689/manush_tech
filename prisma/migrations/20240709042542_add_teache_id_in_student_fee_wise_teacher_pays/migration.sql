-- AddForeignKey
ALTER TABLE `student_fee_wise_teacher_pays` ADD CONSTRAINT `student_fee_wise_teacher_pays_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
