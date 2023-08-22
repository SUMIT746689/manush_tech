/*
  Warnings:

  - A unique constraint covering the columns `[class_registration_no]` on the table `students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `students_class_registration_no_key` ON `students`(`class_registration_no`);
