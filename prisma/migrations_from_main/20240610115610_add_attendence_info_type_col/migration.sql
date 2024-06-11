-- CreateTable
CREATE TABLE `attendence_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` JSON NULL,
    `school_id` INTEGER NOT NULL,
    `type` ENUM('automatic', 'external_api') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
