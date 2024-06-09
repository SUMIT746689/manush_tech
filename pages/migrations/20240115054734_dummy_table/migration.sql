-- CreateTable
CREATE TABLE `MehediDummy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `every_hit` BOOLEAN NOT NULL DEFAULT false,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `MehediDummy_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ridoydummy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `every_hit` BOOLEAN NOT NULL DEFAULT false,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `ridoydummy_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Firoz_Dummy` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `body` VARCHAR(191) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT false,
    `every_hit` BOOLEAN NOT NULL DEFAULT false,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `Firoz_Dummy_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_MehediToRidoy` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_MehediToRidoy_AB_unique`(`A`, `B`),
    INDEX `_MehediToRidoy_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FirozDummyToRidoyDummy` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_FirozDummyToRidoyDummy_AB_unique`(`A`, `B`),
    INDEX `_FirozDummyToRidoyDummy_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_mehedi_to_firoz` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_mehedi_to_firoz_AB_unique`(`A`, `B`),
    INDEX `_mehedi_to_firoz_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_MehediToRidoy` ADD CONSTRAINT `_MehediToRidoy_A_fkey` FOREIGN KEY (`A`) REFERENCES `MehediDummy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_MehediToRidoy` ADD CONSTRAINT `_MehediToRidoy_B_fkey` FOREIGN KEY (`B`) REFERENCES `ridoydummy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FirozDummyToRidoyDummy` ADD CONSTRAINT `_FirozDummyToRidoyDummy_A_fkey` FOREIGN KEY (`A`) REFERENCES `Firoz_Dummy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FirozDummyToRidoyDummy` ADD CONSTRAINT `_FirozDummyToRidoyDummy_B_fkey` FOREIGN KEY (`B`) REFERENCES `ridoydummy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_mehedi_to_firoz` ADD CONSTRAINT `_mehedi_to_firoz_A_fkey` FOREIGN KEY (`A`) REFERENCES `Firoz_Dummy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_mehedi_to_firoz` ADD CONSTRAINT `_mehedi_to_firoz_B_fkey` FOREIGN KEY (`B`) REFERENCES `MehediDummy`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
