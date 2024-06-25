-- CreateTable
CREATE TABLE `_students_to_batches` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_students_to_batches_AB_unique`(`A`, `B`),
    INDEX `_students_to_batches_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_students_to_batches` ADD CONSTRAINT `_students_to_batches_A_fkey` FOREIGN KEY (`A`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_students_to_batches` ADD CONSTRAINT `_students_to_batches_B_fkey` FOREIGN KEY (`B`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
