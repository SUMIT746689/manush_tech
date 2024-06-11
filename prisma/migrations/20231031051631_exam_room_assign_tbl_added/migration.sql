-- DropForeignKey
ALTER TABLE `exam_details` DROP FOREIGN KEY `exam_details_exam_room_fkey`;

-- CreateTable
CREATE TABLE `_examRoom` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_examRoom_AB_unique`(`A`, `B`),
    INDEX `_examRoom_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_examRoom` ADD CONSTRAINT `_examRoom_A_fkey` FOREIGN KEY (`A`) REFERENCES `exam_details`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_examRoom` ADD CONSTRAINT `_examRoom_B_fkey` FOREIGN KEY (`B`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
