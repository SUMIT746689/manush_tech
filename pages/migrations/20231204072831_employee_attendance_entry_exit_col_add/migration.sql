-- AlterTable
ALTER TABLE `employee_attendances` ADD COLUMN `entry_time` DATETIME(3) NULL,
    ADD COLUMN `exit_time` DATETIME(3) NULL;
