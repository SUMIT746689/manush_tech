-- CreateTable
CREATE TABLE `voice_gateways` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `details` JSON NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `voice_gateways_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `voice_gateways` ADD CONSTRAINT `voice_gateways_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
