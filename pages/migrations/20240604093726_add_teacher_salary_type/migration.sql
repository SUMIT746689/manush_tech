-- AlterTable
ALTER TABLE `teachers` ADD COLUMN `salary_type` ENUM('percentage_wise', 'class_wise', 'monthly') NULL;
