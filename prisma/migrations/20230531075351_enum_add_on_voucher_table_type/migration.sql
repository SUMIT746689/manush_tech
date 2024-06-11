-- AlterTable
ALTER TABLE `vouchers` MODIFY `resource_type` ENUM('student', 'teacher', 'fee', 'studentFee') NOT NULL;
