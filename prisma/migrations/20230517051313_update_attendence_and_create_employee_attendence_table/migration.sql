-- AlterTable
ALTER TABLE `attendances` ADD COLUMN `exam_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `employee_attendances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `status` ENUM('present', 'absent', 'late', 'half_holiday', 'holiday') NOT NULL,
    `remark` VARCHAR(191) NULL,
    `school_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_attendances` ADD CONSTRAINT `employee_attendances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
