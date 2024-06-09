/*
  Warnings:

  - You are about to alter the column `resource_type` on the `vouchers` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(11))` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `vouchers` MODIFY `resource_type` VARCHAR(191) NOT NULL;
