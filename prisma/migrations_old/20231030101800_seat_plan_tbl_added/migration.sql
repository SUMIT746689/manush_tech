-- CreateTable
CREATE TABLE `seat_plan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_details_id` INTEGER NOT NULL,
    `class_roll_from` VARCHAR(191) NOT NULL,
    `class_roll_to` VARCHAR(191) NOT NULL,
    `student_count` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seat_plan` ADD CONSTRAINT `seat_plan_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
