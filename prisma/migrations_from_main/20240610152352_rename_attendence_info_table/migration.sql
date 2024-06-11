/*
  Warnings:

  - You are about to drop the `attendence_logs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `attendence_logs`;

-- CreateTable
CREATE TABLE `attendence_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` JSON NULL,
    `school_id` INTEGER NOT NULL,
    `type` ENUM('automatic', 'external_api') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
