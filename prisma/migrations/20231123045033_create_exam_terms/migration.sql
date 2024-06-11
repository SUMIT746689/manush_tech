-- AlterTable
ALTER TABLE `exams` ADD COLUMN `exam_term_id` INTEGER NULL;

-- CreateTable
CREATE TABLE `exam_terms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exam_terms` ADD CONSTRAINT `exam_terms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_terms` ADD CONSTRAINT `exam_terms_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_exam_term_id_fkey` FOREIGN KEY (`exam_term_id`) REFERENCES `exam_terms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
