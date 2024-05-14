-- AlterTable
ALTER TABLE `fees` ADD COLUMN `fees_head_id` INTEGER NULL,
    ADD COLUMN `fees_month` ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december') NULL,
    ADD COLUMN `frequency` ENUM('on_demand', 'half_yearly', 'monthly', 'annual') NULL;

-- CreateTable
CREATE TABLE `fees_head` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `frequency` ENUM('on_demand', 'half_yearly', 'monthly', 'annual') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_fees_head_id_fkey` FOREIGN KEY (`fees_head_id`) REFERENCES `fees_head`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
