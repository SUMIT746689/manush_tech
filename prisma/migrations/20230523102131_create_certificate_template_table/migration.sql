-- CreateTable
CREATE TABLE `certificate_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `user_type` ENUM('student', 'employee') NOT NULL,
    `page_layout` ENUM('a4_potrait', 'a4_landscape') NOT NULL,
    `student_qr_code` VARCHAR(191) NOT NULL,
    `employee_qr_code` VARCHAR(191) NOT NULL,
    `photo_style` ENUM('square', 'round') NOT NULL,
    `photo_size` DOUBLE NOT NULL,
    `top_space` DOUBLE NOT NULL,
    `bottom_space` DOUBLE NOT NULL,
    `right_space` DOUBLE NOT NULL,
    `left_space` DOUBLE NOT NULL,
    `signature_url` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NOT NULL,
    `background_url` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `certificate_templates` ADD CONSTRAINT `certificate_templates_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
