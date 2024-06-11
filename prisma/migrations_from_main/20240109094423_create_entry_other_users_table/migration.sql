-- CreateTable
CREATE TABLE `other_users_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `blood_group` VARCHAR(20) NULL,
    `religion` VARCHAR(191) NULL,
    `date_of_birth` DATE NOT NULL,
    `present_address` VARCHAR(191) NOT NULL,
    `permanent_address` VARCHAR(191) NOT NULL,
    `joining_date` DATE NOT NULL,
    `resume` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `employee_id` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `other_users_info_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `other_users_info` ADD CONSTRAINT `other_users_info_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `other_users_info` ADD CONSTRAINT `other_users_info_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
