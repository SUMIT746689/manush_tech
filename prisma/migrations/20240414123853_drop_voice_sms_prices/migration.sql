/*
  Warnings:

  - You are about to drop the column `voice_pulse_size` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `voice_sms_balance` on the `schools` table. All the data in the column will be lost.
  - You are about to drop the column `voice_sms_price` on the `schools` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `schools` DROP COLUMN `voice_pulse_size`,
    DROP COLUMN `voice_sms_balance`,
    DROP COLUMN `voice_sms_price`;
