-- CreateTable
CREATE TABLE `addtional_marking_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_addtional_marks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total_mark` DOUBLE NOT NULL,
    `addtional_mark_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `addtional_marking_categories` ADD CONSTRAINT `addtional_marking_categories_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_addtional_marks` ADD CONSTRAINT `exam_addtional_marks_addtional_mark_id_fkey` FOREIGN KEY (`addtional_mark_id`) REFERENCES `addtional_marking_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_addtional_marks` ADD CONSTRAINT `exam_addtional_marks_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
