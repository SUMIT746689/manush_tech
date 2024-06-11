-- CreateTable
CREATE TABLE `syllabus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Syllabus_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `syllabus_id` INTEGER NOT NULL,
    `body` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `syllabus` ADD CONSTRAINT `syllabus_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `syllabus` ADD CONSTRAINT `syllabus_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `syllabus` ADD CONSTRAINT `syllabus_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Syllabus_details` ADD CONSTRAINT `Syllabus_details_syllabus_id_fkey` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
