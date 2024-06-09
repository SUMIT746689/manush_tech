/*
  Warnings:

  - You are about to drop the `teacher_recruitment_forms` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `teacher_recruitment_forms` DROP FOREIGN KEY `teacher_recruitment_forms_school_id_fkey`;

-- DropTable
DROP TABLE `teacher_recruitment_forms`;

-- CreateTable
CREATE TABLE `student_admission_forms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_url` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `student_admission_forms_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `student_admission_forms` ADD CONSTRAINT `student_admission_forms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
