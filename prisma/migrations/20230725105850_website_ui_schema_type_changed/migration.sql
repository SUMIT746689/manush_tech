/*
  Warnings:

  - You are about to alter the column `exam_date` on the `exam_details` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `exam_details` MODIFY `exam_date` DATETIME NOT NULL;

-- AlterTable
ALTER TABLE `website_uis` MODIFY `history_description` LONGTEXT NULL,
    MODIFY `chairman_speech` LONGTEXT NULL,
    MODIFY `principal_speech` LONGTEXT NULL,
    MODIFY `school_history` LONGTEXT NULL;
