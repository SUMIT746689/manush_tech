-- AlterTable
ALTER TABLE `student_informations` ADD COLUMN `father_nid` VARCHAR(191) NULL,
    ADD COLUMN `mother_nid` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `students` ADD COLUMN `guardian_nid` VARCHAR(191) NULL;
