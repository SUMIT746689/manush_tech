-- DropForeignKey
ALTER TABLE `teachers` DROP FOREIGN KEY `teachers_department_id_fkey`;

-- AlterTable
ALTER TABLE `teachers` MODIFY `department_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
