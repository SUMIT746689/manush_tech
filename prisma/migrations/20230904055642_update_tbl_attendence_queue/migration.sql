/*
  Warnings:

  - You are about to drop the `tbl_attendence_queue` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `tbl_attendence_queue` DROP FOREIGN KEY `tbl_attendence_queue_school_id_fkey`;

-- DropForeignKey
ALTER TABLE `tbl_attendence_queue` DROP FOREIGN KEY `tbl_attendence_queue_user_id_fkey`;

-- DropTable
DROP TABLE `tbl_attendence_queue`;

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

-- AddForeignKey
ALTER TABLE `tbl_attendance_queue` ADD CONSTRAINT `tbl_attendance_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_attendance_queue` ADD CONSTRAINT `tbl_attendance_queue_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
