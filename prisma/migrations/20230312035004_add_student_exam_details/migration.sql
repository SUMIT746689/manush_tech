-- CreateTable
CREATE TABLE `student_results` (
    `student_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `total_marks_obtained` DOUBLE NOT NULL,
    `grade` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`student_id`, `exam_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_result_details` (
    `student_id` INTEGER NOT NULL,
    `exam_details_id` INTEGER NOT NULL,
    `subject_total` DOUBLE NOT NULL,
    `mark_obtained` DOUBLE NOT NULL,

    PRIMARY KEY (`student_id`, `exam_details_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
