-- CreateTable
CREATE TABLE `package_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `paymentID` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentExecuteTime` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pay_via` VARCHAR(191) NOT NULL,
    `trxID` VARCHAR(191) NOT NULL,
    `merchantInvoiceNumber` VARCHAR(191) NOT NULL,
    `customerMsisdn` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `package_transaction` ADD CONSTRAINT `package_transaction_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `package_transaction` ADD CONSTRAINT `package_transaction_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
