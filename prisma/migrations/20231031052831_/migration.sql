/*
  Warnings:

  - You are about to drop the column `exam_room` on the `exam_details` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `exam_details_exam_room_fkey` ON `exam_details`;

-- AlterTable
ALTER TABLE `exam_details` DROP COLUMN `exam_room`;
