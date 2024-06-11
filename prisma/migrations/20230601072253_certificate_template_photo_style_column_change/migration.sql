/*
  Warnings:

  - The values [round] on the enum `certificate_templates_photo_style` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `certificate_templates` MODIFY `photo_style` ENUM('circular', 'rounded', 'square') NOT NULL;
