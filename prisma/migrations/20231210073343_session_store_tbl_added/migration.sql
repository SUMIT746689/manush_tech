-- CreateTable
CREATE TABLE `session_store` (
    `paymentID` VARCHAR(191) NOT NULL,
    `token` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`paymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
