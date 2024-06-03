-- CreateTable
CREATE TABLE `_std_cls_subjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_std_cls_subjects_AB_unique`(`A`, `B`),
    INDEX `_std_cls_subjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_std_cls_subjects` ADD CONSTRAINT `_std_cls_subjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_std_cls_subjects` ADD CONSTRAINT `_std_cls_subjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
