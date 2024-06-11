/*
  Warnings:

  - You are about to drop the `seat_plan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `seat_plan` DROP FOREIGN KEY `seat_plan_exam_details_id_fkey`;

-- DropForeignKey
ALTER TABLE `seat_plan` DROP FOREIGN KEY `seat_plan_room_id_fkey`;

-- DropTable
DROP TABLE `seat_plan`;

-- CreateTable
CREATE TABLE `seat_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_details_id` INTEGER NOT NULL,
    `class_roll_from` VARCHAR(191) NOT NULL,
    `class_roll_to` VARCHAR(191) NOT NULL,
    `student_count` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,

    UNIQUE INDEX `seat_plans_exam_details_id_room_id_key`(`exam_details_id`, `room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_teacher_to_seat_plan` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_teacher_to_seat_plan_AB_unique`(`A`, `B`),
    INDEX `_teacher_to_seat_plan_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `seat_plans` ADD CONSTRAINT `seat_plans_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat_plans` ADD CONSTRAINT `seat_plans_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacher_to_seat_plan` ADD CONSTRAINT `_teacher_to_seat_plan_A_fkey` FOREIGN KEY (`A`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacher_to_seat_plan` ADD CONSTRAINT `_teacher_to_seat_plan_B_fkey` FOREIGN KEY (`B`) REFERENCES `seat_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
