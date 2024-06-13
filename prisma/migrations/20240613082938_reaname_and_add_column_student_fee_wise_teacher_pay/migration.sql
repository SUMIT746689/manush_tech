/*
  Warnings:

  - You are about to drop the `studentFeeWiseTeacherPay` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `studentFeeWiseTeacherPay` DROP FOREIGN KEY `studentFeeWiseTeacherPay_student_fee_id_fkey`;

-- DropTable
DROP TABLE `studentFeeWiseTeacherPay`;

-- CreateTable
CREATE TABLE `student_fee_wise_teacher_pays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_fee_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `teacher_pay_type` ENUM('percentage', 'flat') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `collection_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `student_fee_wise_teacher_pays_student_fee_id_key`(`student_fee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_fee_wise_teacher_pays` ADD CONSTRAINT `student_fee_wise_teacher_pays_student_fee_id_fkey` FOREIGN KEY (`student_fee_id`) REFERENCES `student_fees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
