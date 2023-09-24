-- AlterTable
ALTER TABLE `transactions` ADD COLUMN `acccount_number` VARCHAR(191) NULL,
    ADD COLUMN `account_id` INTEGER NULL,
    ADD COLUMN `account_name` VARCHAR(191) NULL,
    ADD COLUMN `attachment` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `voucher_amount` DOUBLE NULL,
    ADD COLUMN `voucher_name` VARCHAR(191) NULL,
    ADD COLUMN `voucher_type` VARCHAR(191) NULL,
    MODIFY `payment_method` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `vouchers` MODIFY `resource_id` INTEGER NULL,
    MODIFY `resource_type` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `payment_method` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `account_number` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `balance` DOUBLE NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `payment_method` ADD CONSTRAINT `payment_method_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
