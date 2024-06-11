-- CreateTable
CREATE TABLE `student_addtional_result_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_addtional_mark_id` INTEGER NOT NULL,
    `total_mark` DOUBLE NOT NULL,
    `grade_id` INTEGER NULL,
    `student_result_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_addtional_result_details` ADD CONSTRAINT `student_addtional_result_details_student_result_id_fkey` FOREIGN KEY (`student_result_id`) REFERENCES `student_results`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_addtional_result_details` ADD CONSTRAINT `student_addtional_result_details_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `grade_systems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
