/*
  Warnings:

  - The primary key for the `seat_plan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `seat_plan` table. All the data in the column will be lost.
  - Added the required column `room_id` to the `seat_plan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `seat_plan` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `room_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`exam_details_id`, `room_id`);

-- AddForeignKey
ALTER TABLE `seat_plan` ADD CONSTRAINT `seat_plan_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
