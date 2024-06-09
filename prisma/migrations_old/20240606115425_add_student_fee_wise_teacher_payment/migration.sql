-- CreateTable
CREATE TABLE `studentFeeWiseTeacherPay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_pay_type` ENUM('percentage', 'flat') NOT NULL,
    `student_fee_id` INTEGER NOT NULL,
    `amount` DOUBLE NOT NULL,

    UNIQUE INDEX `studentFeeWiseTeacherPay_student_fee_id_key`(`student_fee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `studentFeeWiseTeacherPay` ADD CONSTRAINT `studentFeeWiseTeacherPay_student_fee_id_fkey` FOREIGN KEY (`student_fee_id`) REFERENCES `student_fees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
