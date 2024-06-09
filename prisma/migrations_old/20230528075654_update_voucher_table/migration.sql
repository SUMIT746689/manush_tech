/*
  Warnings:

  - You are about to alter the column `resource_id` on the `vouchers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `resource_type` on the `vouchers` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(13))`.

*/
-- AlterTable
ALTER TABLE `vouchers` MODIFY `resource_id` INTEGER NOT NULL,
    MODIFY `resource_type` ENUM('student', 'teacher') NOT NULL;
