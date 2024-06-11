-- CreateTable
CREATE TABLE `TeacherRecruitment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher` JSON NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeacherRecruitment` ADD CONSTRAINT `TeacherRecruitment_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
