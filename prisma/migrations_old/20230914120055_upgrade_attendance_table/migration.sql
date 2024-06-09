-- AlterTable
ALTER TABLE `attendances` ADD COLUMN `class_name` VARCHAR(191) NULL,
    ADD COLUMN `class_roll_no` VARCHAR(191) NULL,
    ADD COLUMN `first_name` VARCHAR(191) NULL,
    ADD COLUMN `last_name` VARCHAR(191) NULL,
    ADD COLUMN `middle_name` VARCHAR(191) NULL,
    ADD COLUMN `section_name` VARCHAR(191) NULL,
    ADD COLUMN `time_diff_in_min` INTEGER NULL,
    MODIFY `status` ENUM('present', 'absent', 'late', 'bunk', 'holiday', 'row_status') NOT NULL;
