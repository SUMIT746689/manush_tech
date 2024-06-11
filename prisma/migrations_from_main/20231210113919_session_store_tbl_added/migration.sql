-- CreateTable
CREATE TABLE `session_store` (
    `paymentID` VARCHAR(191) NOT NULL,
    `token` MEDIUMTEXT NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`paymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
