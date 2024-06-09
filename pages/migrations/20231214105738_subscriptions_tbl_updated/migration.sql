/*
  Warnings:

  - A unique constraint covering the columns `[school_id,package_id]` on the table `subscriptions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `subscription_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_id` INTEGER NOT NULL,
    `edited_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `edited_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `subscriptions_school_id_package_id_key` ON `subscriptions`(`school_id`, `package_id`);

-- AddForeignKey
ALTER TABLE `subscription_history` ADD CONSTRAINT `subscription_history_edited_by_fkey` FOREIGN KEY (`edited_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_history` ADD CONSTRAINT `subscription_history_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
