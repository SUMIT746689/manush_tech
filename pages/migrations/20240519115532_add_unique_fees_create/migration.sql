/*
  Warnings:

  - A unique constraint covering the columns `[fees_month,fees_head_id,class_id,academic_year_id]` on the table `fees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `fees_fees_month_fees_head_id_class_id_academic_year_id_key` ON `fees`(`fees_month`, `fees_head_id`, `class_id`, `academic_year_id`);
