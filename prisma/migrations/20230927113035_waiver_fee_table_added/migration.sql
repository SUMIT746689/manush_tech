-- CreateTable
CREATE TABLE `_WaiverFeesToStudent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_WaiverFeesToStudent_AB_unique`(`A`, `B`),
    INDEX `_WaiverFeesToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_WaiverFeesToStudent` ADD CONSTRAINT `_WaiverFeesToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `fees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WaiverFeesToStudent` ADD CONSTRAINT `_WaiverFeesToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
