-- CreateTable
CREATE TABLE `tbl_manual_student_attendace_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `section_id` INTEGER NULL,
    `school_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_attendance_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `machine_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `submission_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sms_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sms_shoot_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NULL,
    `sms_type` VARCHAR(191) NOT NULL,
    `sms_text` TEXT NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `submission_time` DATETIME(3) NULL,
    `contacts` LONGTEXT NOT NULL,
    `pushed_via` VARCHAR(191) NOT NULL,
    `number_of_sms_parts` INTEGER NOT NULL DEFAULT 1,
    `total_count` INTEGER NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `sms_gateway_status` VARCHAR(191) NULL,
    `fail_count` INTEGER NOT NULL DEFAULT 0,
    `priority` INTEGER NOT NULL DEFAULT 5,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_manual_student_attendace_queue` ADD CONSTRAINT `tbl_manual_student_attendace_queue_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_attendance_queue` ADD CONSTRAINT `tbl_attendance_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_attendance_queue` ADD CONSTRAINT `tbl_attendance_queue_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
