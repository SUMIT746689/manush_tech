/*
  Warnings:

  - You are about to drop the `Firoz_Dummy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MehediDummy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_FirozDummyToRidoyDummy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_MehediToRidoy` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_mehedi_to_firoz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ridoydummy` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `body_format` to the `auto_attendance_sent_sms` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_FirozDummyToRidoyDummy` DROP FOREIGN KEY `_FirozDummyToRidoyDummy_A_fkey`;

-- DropForeignKey
ALTER TABLE `_FirozDummyToRidoyDummy` DROP FOREIGN KEY `_FirozDummyToRidoyDummy_B_fkey`;

-- DropForeignKey
ALTER TABLE `_MehediToRidoy` DROP FOREIGN KEY `_MehediToRidoy_A_fkey`;

-- DropForeignKey
ALTER TABLE `_MehediToRidoy` DROP FOREIGN KEY `_MehediToRidoy_B_fkey`;

-- DropForeignKey
ALTER TABLE `_mehedi_to_firoz` DROP FOREIGN KEY `_mehedi_to_firoz_A_fkey`;

-- DropForeignKey
ALTER TABLE `_mehedi_to_firoz` DROP FOREIGN KEY `_mehedi_to_firoz_B_fkey`;

-- AlterTable
ALTER TABLE `auto_attendance_sent_sms` ADD COLUMN `body_format` ENUM('text', 'unicode') NOT NULL;

-- DropTable
DROP TABLE `Firoz_Dummy`;

-- DropTable
DROP TABLE `MehediDummy`;

-- DropTable
DROP TABLE `_FirozDummyToRidoyDummy`;

-- DropTable
DROP TABLE `_MehediToRidoy`;

-- DropTable
DROP TABLE `_mehedi_to_firoz`;

-- DropTable
DROP TABLE `ridoydummy`;
