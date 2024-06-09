/*
  Warnings:

  - A unique constraint covering the columns `[school_id,title]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `accounts_school_id_title_key` ON `accounts`(`school_id`, `title`);
