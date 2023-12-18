-- CreateTable
CREATE TABLE `teacher_recruitment_forms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_url` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `teacher_recruitment_forms_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `teacher_recruitment_forms` ADD CONSTRAINT `teacher_recruitment_forms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
