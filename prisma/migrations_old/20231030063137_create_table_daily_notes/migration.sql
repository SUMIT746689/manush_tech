-- CreateTable
CREATE TABLE `daily_notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` LONGTEXT NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `daily_notes` ADD CONSTRAINT `daily_notes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
