/*
  Warnings:

  - The primary key for the `student_result_details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exam_id` on the `student_result_details` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `student_result_details` table. All the data in the column will be lost.
  - The primary key for the `student_results` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `student_result_id` to the `student_result_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `student_results` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `student_result_details` DROP FOREIGN KEY `student_result_details_student_id_fkey`;

-- AlterTable
ALTER TABLE `student_result_details` DROP PRIMARY KEY,
    DROP COLUMN `exam_id`,
    DROP COLUMN `student_id`,
    ADD COLUMN `student_result_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`student_result_id`, `exam_details_id`);


ALTER TABLE `student_results` DROP FOREIGN KEY `student_results_exam_id_fkey`;
ALTER TABLE `student_results` DROP FOREIGN KEY `student_results_student_id_fkey`;


-- AlterTable
ALTER TABLE `student_results` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `grade` VARCHAR(20) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_student_result_id_fkey` FOREIGN KEY (`student_result_id`) REFERENCES `student_results`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
