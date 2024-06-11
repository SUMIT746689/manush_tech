-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `user_role_id` INTEGER NOT NULL,
    `role_id` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,
    `is_enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_photo` VARCHAR(191) NULL,
    `school_id` INTEGER NULL,
    `admin_panel_id` INTEGER NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_panels` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `domain` VARCHAR(191) NOT NULL,
    `logo` VARCHAR(191) NULL,
    `copy_right_txt` VARCHAR(191) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `admin_panels_domain_key`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `domain` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,
    `main_balance` DOUBLE NULL,
    `masking_sms_count` INTEGER NOT NULL DEFAULT 0,
    `non_masking_sms_count` INTEGER NOT NULL DEFAULT 0,
    `masking_sms_price` DOUBLE NULL DEFAULT 0,
    `non_masking_sms_price` DOUBLE NULL DEFAULT 0,
    `current_academic_year_id` INTEGER NULL,
    `voice_sms_balance` DOUBLE NOT NULL DEFAULT 0,
    `voice_sms_price` DOUBLE NOT NULL DEFAULT 0,
    `voice_pulse_size` INTEGER NOT NULL DEFAULT 0,
    `admin_panel_id` INTEGER NULL,

    UNIQUE INDEX `schools_domain_key`(`domain`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Role` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teachers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `blood_group` VARCHAR(20) NULL,
    `religion` VARCHAR(191) NULL,
    `date_of_birth` DATE NOT NULL,
    `salary_type` ENUM('percentage_wise', 'class_wise', 'monthly') NULL,
    `teacher_id` VARCHAR(191) NULL,
    `present_address` VARCHAR(191) NOT NULL,
    `permanent_address` VARCHAR(191) NOT NULL,
    `joining_date` DATE NOT NULL,
    `resume` VARCHAR(191) NOT NULL,
    `photo` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `department_id` INTEGER NULL,
    `user_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `teachers_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `has_section` BOOLEAN NOT NULL DEFAULT false,
    `school_id` INTEGER NOT NULL,
    `is_extra` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sections` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(40) NULL,
    `class_id` INTEGER NOT NULL,
    `class_teacher_id` INTEGER NULL,
    `is_class` BOOLEAN NOT NULL DEFAULT true,
    `std_entry_time` TIME NULL,
    `std_late_time` TIME NULL,
    `std_absence_time` TIME NULL,
    `std_exit_time` TIME NULL,
    `updated_by` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_informations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `school_id` INTEGER NOT NULL,
    `admission_no` VARCHAR(191) NULL,
    `admission_date` DATETIME(3) NOT NULL,
    `admission_status` ENUM('waiting', 'approved', 'declined') NOT NULL DEFAULT 'waiting',
    `date_of_birth` DATE NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `blood_group` VARCHAR(20) NULL,
    `religion` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `father_name` VARCHAR(191) NULL,
    `father_phone` VARCHAR(191) NULL,
    `father_profession` VARCHAR(191) NULL,
    `father_photo` VARCHAR(191) NULL,
    `father_nid` VARCHAR(191) NULL,
    `mother_name` VARCHAR(191) NULL,
    `mother_phone` VARCHAR(191) NULL,
    `mother_profession` VARCHAR(191) NULL,
    `mother_photo` VARCHAR(191) NULL,
    `mother_nid` VARCHAR(191) NULL,
    `student_permanent_address` VARCHAR(191) NULL,
    `previous_school` VARCHAR(191) NULL,

    UNIQUE INDEX `student_informations_user_id_key`(`user_id`),
    UNIQUE INDEX `student_informations_student_id_school_id_key`(`student_id`, `school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_information_id` INTEGER NOT NULL,
    `section_id` INTEGER NOT NULL,
    `group_id` INTEGER NULL,
    `academic_year_id` INTEGER NOT NULL,
    `class_roll_no` VARCHAR(191) NOT NULL,
    `class_registration_no` VARCHAR(191) NOT NULL,
    `student_photo` VARCHAR(191) NULL,
    `guardian_name` VARCHAR(191) NULL,
    `guardian_phone` VARCHAR(191) NULL,
    `guardian_profession` VARCHAR(191) NULL,
    `guardian_photo` VARCHAR(191) NULL,
    `guardian_nid` VARCHAR(191) NULL,
    `relation_with_guardian` VARCHAR(191) NULL,
    `student_present_address` VARCHAR(191) NULL,
    `extra_section_id` INTEGER NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `students_class_registration_no_key`(`class_registration_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `class_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rooms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `periods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `room_id` INTEGER NOT NULL,
    `day` ENUM('Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL,
    `teacher_id` INTEGER NULL,
    `section_id` INTEGER NULL,
    `school_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Group` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `class_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fees_head` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `frequency` ENUM('on_demand', 'half_yearly', 'monthly', 'annual') NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `for` VARCHAR(191) NULL,
    `amount` DOUBLE NOT NULL,
    `last_date` DATETIME(3) NOT NULL,
    `late_fee` DOUBLE NULL DEFAULT 0,
    `frequency` ENUM('on_demand', 'half_yearly', 'monthly', 'annual') NULL,
    `fees_month` ENUM('january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december') NULL,
    `academic_year_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `fees_head_id` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `fee_id` INTEGER NULL,
    `collected_amount` DOUBLE NOT NULL,
    `payment_method` VARCHAR(191) NOT NULL,
    `transID` VARCHAR(191) NULL,
    `account_id` INTEGER NULL,
    `payment_method_id` INTEGER NULL,
    `collected_by` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `transaction_id` INTEGER NULL,
    `status` VARCHAR(191) NULL,
    `total_payable` DOUBLE NULL,
    `other_fee_name` VARCHAR(191) NULL,
    `collection_date` DATETIME(3) NULL,
    `on_time_discount` INTEGER NULL,

    UNIQUE INDEX `student_fees_transaction_id_key`(`transaction_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `holidays` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `date` DATE NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `academic_years` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `curr_active` BOOLEAN NOT NULL DEFAULT false,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_terms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `section_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `final_percent` INTEGER NULL,
    `exam_term_id` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `subject_total` DOUBLE NOT NULL,
    `exam_date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `seat_plans` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_details_id` INTEGER NOT NULL,
    `class_roll_from` VARCHAR(191) NOT NULL,
    `class_roll_to` VARCHAR(191) NOT NULL,
    `student_count` INTEGER NOT NULL,
    `room_id` INTEGER NOT NULL,

    UNIQUE INDEX `seat_plans_exam_details_id_room_id_key`(`exam_details_id`, `room_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attendances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `first_name` VARCHAR(191) NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `class_name` VARCHAR(191) NULL,
    `section_name` VARCHAR(191) NULL,
    `class_roll_no` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `status` ENUM('present', 'absence', 'late', 'bunk', 'holiday', 'row_status') NOT NULL,
    `remark` VARCHAR(191) NULL,
    `section_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `exam_id` INTEGER NULL,
    `time_diff_in_min` INTEGER NULL,
    `entry_time` DATETIME(3) NULL,
    `exit_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employee_attendances` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `status` ENUM('present', 'absent', 'late', 'half_holiday', 'holiday') NOT NULL,
    `remark` VARCHAR(191) NULL,
    `school_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `entry_time` DATETIME(3) NULL,
    `exit_time` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `total_marks_obtained` DOUBLE NOT NULL,
    `calculated_grade` VARCHAR(191) NOT NULL,
    `calculated_point` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_result_details` (
    `student_result_id` INTEGER NOT NULL,
    `exam_details_id` INTEGER NOT NULL,
    `mark_obtained` DOUBLE NOT NULL,
    `grade_id` INTEGER NOT NULL,

    PRIMARY KEY (`student_result_id`, `exam_details_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `price` DOUBLE NOT NULL,
    `duration` INTEGER NOT NULL,
    `student_count` INTEGER NULL,
    `is_std_cnt_wise` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `package_id` INTEGER NOT NULL,
    `paymentID` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `paymentExecuteTime` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `pay_via` VARCHAR(191) NOT NULL,
    `trxID` VARCHAR(191) NOT NULL,
    `merchantInvoiceNumber` VARCHAR(191) NOT NULL,
    `customerMsisdn` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `request_packages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `document_photo` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'approved', 'declined') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `package_id` INTEGER NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    `is_active` BOOLEAN NOT NULL,

    UNIQUE INDEX `subscriptions_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscription_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscription_id` INTEGER NOT NULL,
    `edited_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `edited_by` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `website_uis` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `header_image` VARCHAR(191) NOT NULL,
    `carousel_image` JSON NULL,
    `school_history` LONGTEXT NULL,
    `school_id` INTEGER NOT NULL,
    `history_photo` VARCHAR(191) NOT NULL,
    `history_description` LONGTEXT NULL,
    `chairman_photo` VARCHAR(191) NOT NULL,
    `chairman_speech` LONGTEXT NULL,
    `principal_photo` VARCHAR(191) NOT NULL,
    `principal_speech` LONGTEXT NULL,
    `eiin_number` VARCHAR(191) NOT NULL,
    `gallery` JSON NULL,
    `facebook_link` VARCHAR(191) NULL,
    `youtube_link` VARCHAR(191) NULL,
    `twitter_link` VARCHAR(191) NULL,
    `google_link` VARCHAR(191) NULL,
    `linkedin_link` VARCHAR(191) NULL,
    `e_books_section` JSON NULL,
    `downloads_section` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sms_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `voice_url` VARCHAR(191) NOT NULL,
    `voice_duration` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sms_gateway` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `details` JSON NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `sms_gateway_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sms_campaings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `recipient_type` ENUM('group', 'class', 'individual') NULL,
    `recipient_count` INTEGER NULL,
    `sms_template_id` INTEGER NULL,
    `sms_gateway_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `custom_body` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `body` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `email_campaigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `recipient_type` ENUM('group', 'class', 'individual') NULL,
    `recipient_count` INTEGER NULL,
    `email_template_id` INTEGER NULL,
    `subject` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `custom_body` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `user_type` ENUM('student', 'employee') NOT NULL,
    `page_layout` ENUM('a4_potrait', 'a4_landscape') NOT NULL,
    `student_qr_code` VARCHAR(191) NULL,
    `employee_qr_code` VARCHAR(191) NULL,
    `photo_style` ENUM('circular', 'rounded', 'square') NOT NULL,
    `photo_size` DOUBLE NOT NULL,
    `top_space` DOUBLE NOT NULL,
    `bottom_space` DOUBLE NOT NULL,
    `right_space` DOUBLE NOT NULL,
    `left_space` DOUBLE NOT NULL,
    `signature_url` VARCHAR(191) NOT NULL,
    `logo_url` VARCHAR(191) NOT NULL,
    `background_url` VARCHAR(191) NOT NULL,
    `content` JSON NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grade_systems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lower_mark` DOUBLE NOT NULL,
    `upper_mark` DOUBLE NOT NULL,
    `point` DOUBLE NULL,
    `grade` VARCHAR(191) NULL,
    `school_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vouchers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NULL,
    `reference` VARCHAR(191) NOT NULL,
    `type` ENUM('debit', 'credit') NOT NULL,
    `resource_id` INTEGER NULL,
    `resource_type` VARCHAR(191) NULL,
    `school_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_method` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `account_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `account_number` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `balance` DOUBLE NOT NULL,
    `school_id` INTEGER NOT NULL,
    `is_dafault` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `accounts_school_id_title_key`(`school_id`, `title`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `transID` VARCHAR(191) NULL,
    `voucher_id` INTEGER NOT NULL,
    `account_id` INTEGER NULL,
    `payment_method_id` INTEGER NULL,
    `school_id` INTEGER NOT NULL,
    `tracking_number` VARCHAR(191) NULL,
    `account_name` VARCHAR(191) NULL,
    `acccount_number` VARCHAR(191) NULL,
    `payment_method` VARCHAR(191) NULL,
    `voucher_name` VARCHAR(191) NULL,
    `voucher_type` VARCHAR(191) NULL,
    `voucher_amount` DOUBLE NULL,
    `Ref` VARCHAR(191) NULL,
    `attachment` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `headLine` MEDIUMTEXT NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leave` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `from_date` DATETIME(3) NOT NULL,
    `to_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` ENUM('pending', 'approved', 'declined') NOT NULL,
    `Leave_type` ENUM('sick', 'casual', 'maternity') NOT NULL,
    `description` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `approved_by_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OnlineAdmission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student` JSON NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TeacherRecruitment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher` JSON NOT NULL,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Discount` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `fee_id` INTEGER NOT NULL,
    `type` ENUM('percent', 'flat') NOT NULL,
    `amt` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_student_sent_sms_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `class_id` INTEGER NOT NULL,
    `section_id` INTEGER NULL,
    `school_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `sent_sms_std_status` ENUM('all_type', 'present', 'late', 'absence') NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_attendance_queue` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `machine_id` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `status` INTEGER NOT NULL,
    `submission_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_queued_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sms_shoot_id` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `school_name` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NULL,
    `sender_id` INTEGER NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `contacts` LONGTEXT NOT NULL,
    `pushed_via` VARCHAR(191) NOT NULL,
    `charges_per_sms` DOUBLE NOT NULL DEFAULT 0,
    `number_of_sms_parts` INTEGER NOT NULL DEFAULT 1,
    `total_count` INTEGER NOT NULL,
    `sms_type` VARCHAR(191) NOT NULL,
    `sms_text` TEXT NOT NULL,
    `submission_time` DATETIME(3) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `sms_gateway_status` VARCHAR(191) NULL,
    `priority` INTEGER NOT NULL DEFAULT 5,

    UNIQUE INDEX `tbl_queued_sms_id_status_key`(`id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sent_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sms_shoot_id` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `school_name` VARCHAR(191) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `user_name` VARCHAR(191) NULL,
    `sender_id` INTEGER NOT NULL,
    `sender_name` VARCHAR(191) NULL,
    `contacts` LONGTEXT NOT NULL,
    `pushed_via` VARCHAR(191) NOT NULL,
    `charges_per_sms` DOUBLE NOT NULL DEFAULT 0,
    `number_of_sms_parts` INTEGER NOT NULL DEFAULT 1,
    `total_count` INTEGER NOT NULL,
    `sms_type` VARCHAR(191) NOT NULL,
    `sms_text` TEXT NOT NULL,
    `submission_time` DATETIME(3) NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `sms_gateway_status` VARCHAR(191) NULL,

    UNIQUE INDEX `tbl_sent_sms_id_status_key`(`id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requests_buy_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `masking_count` INTEGER NULL,
    `non_masking_count` INTEGER NULL,
    `document_photo` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `status` ENUM('pending', 'approved', 'declined') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sms_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `user_name` VARCHAR(191) NULL,
    `masking_count` INTEGER NULL,
    `non_masking_count` INTEGER NULL,
    `prev_masking_count` INTEGER NULL,
    `prev_non_masking_count` INTEGER NULL,
    `voice_sms_balance` DOUBLE NULL,
    `prev_voice_sms_balance` DOUBLE NULL,
    `pushed_via` VARCHAR(191) NULL,
    `is_voice` BOOLEAN NOT NULL DEFAULT false,
    `school_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `daily_notes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `note` LONGTEXT NOT NULL,
    `period_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `daily_notes_period_id_date_key`(`period_id`, `date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `syllabus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `academic_year_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `syllabus_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `syllabus_id` INTEGER NOT NULL,
    `body` MEDIUMTEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_details_id` INTEGER NOT NULL,
    `content` LONGTEXT NULL,
    `file` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `addtional_marking_categories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_addtional_marks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `total_mark` DOUBLE NOT NULL,
    `addtional_mark_id` INTEGER NOT NULL,
    `exam_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `exam_addtional_marks_addtional_mark_id_exam_id_key`(`addtional_mark_id`, `exam_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_addtional_result_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exam_addtional_mark_id` INTEGER NOT NULL,
    `mark_obtained` DOUBLE NOT NULL,
    `grade_id` INTEGER NULL,
    `student_result_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `homework` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subject_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `date` DATE NOT NULL,
    `academic_year_id` INTEGER NOT NULL,
    `file_path` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session_store` (
    `paymentID` VARCHAR(191) NOT NULL,
    `token` MEDIUMTEXT NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `data` JSON NOT NULL,

    PRIMARY KEY (`paymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `banners` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `banners` JSON NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `student_admission_forms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `file_url` VARCHAR(191) NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `student_admission_forms_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payment_gateway_credential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` ENUM('bkash', 'nagad', 'nexus', 'amarPay', 'surjoPay', 'sslcommerz') NOT NULL,
    `details` JSON NOT NULL,
    `is_active` BOOLEAN NOT NULL,
    `school_id` INTEGER NOT NULL,
    `account_id` INTEGER NOT NULL,

    UNIQUE INDEX `payment_gateway_credential_title_school_id_key`(`title`, `school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `auto_attendance_sent_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `present_body` VARCHAR(191) NULL,
    `present_body_format` ENUM('text', 'unicode') NULL,
    `late_body` VARCHAR(191) NULL,
    `late_body_format` ENUM('text', 'unicode') NULL,
    `absence_body` VARCHAR(191) NULL,
    `absence_body_format` ENUM('text', 'unicode') NULL,
    `admission_body` VARCHAR(191) NULL,
    `admission_body_format` ENUM('text', 'unicode') NULL,
    `every_hit` BOOLEAN NOT NULL DEFAULT false,
    `external_api_info` JSON NULL,
    `is_attendence_active` BOOLEAN NOT NULL DEFAULT false,
    `is_sms_active` BOOLEAN NOT NULL DEFAULT false,
    `is_present_sms_active` BOOLEAN NOT NULL DEFAULT false,
    `is_late_sms_active` BOOLEAN NOT NULL DEFAULT false,
    `is_absence_sms_active` BOOLEAN NOT NULL DEFAULT false,
    `is_admission_sms_active` BOOLEAN NOT NULL DEFAULT false,
    `updated_by` JSON NULL,
    `default_sms_template` ENUM('present', 'late', 'absence') NOT NULL DEFAULT 'present',
    `use_system_type` ENUM('automatic', 'external_api') NOT NULL DEFAULT 'automatic',
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `auto_attendance_sent_sms_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `other_users_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `first_name` VARCHAR(191) NOT NULL,
    `middle_name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `national_id` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `gender` ENUM('male', 'female') NOT NULL,
    `blood_group` VARCHAR(20) NULL,
    `religion` VARCHAR(191) NULL,
    `date_of_birth` DATE NOT NULL,
    `present_address` VARCHAR(191) NOT NULL,
    `permanent_address` VARCHAR(191) NOT NULL,
    `joining_date` DATE NOT NULL,
    `resume` VARCHAR(191) NULL,
    `photo` VARCHAR(191) NULL,
    `deleted_at` DATETIME(3) NULL,
    `employee_id` VARCHAR(191) NULL,
    `user_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `other_users_info_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `voice_gateways` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `details` JSON NOT NULL,
    `school_id` INTEGER NOT NULL,

    UNIQUE INDEX `voice_gateways_school_id_key`(`school_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_sent_voice_sms` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `message_id` VARCHAR(191) NOT NULL,
    `send_by_user_id` INTEGER NOT NULL,
    `send_by_user_name` VARCHAR(191) NOT NULL,
    `status` INTEGER NOT NULL DEFAULT 0,
    `voice_url` VARCHAR(191) NOT NULL,
    `contacts` LONGTEXT NOT NULL,
    `sender_id` VARCHAR(191) NOT NULL,
    `pushed_via` ENUM('voice_recipient', 'group_contact', 'file_upload') NOT NULL,
    `school_id` INTEGER NOT NULL,
    `voice_duration` INTEGER NOT NULL DEFAULT 0,
    `pulse_size` INTEGER NOT NULL DEFAULT 0,
    `charges_per_pulses` DOUBLE NOT NULL DEFAULT 0,
    `number_of_sms_pulses` INTEGER NOT NULL DEFAULT 1,
    `total_count` INTEGER NOT NULL DEFAULT 0,
    `logs` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `tbl_sent_voice_sms_message_id_key`(`message_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tbl_schools_transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `school_name` VARCHAR(191) NOT NULL,
    `updated_by_user_id` INTEGER NULL,
    `updated_by_user_name` VARCHAR(191) NULL,
    `main_balance` DOUBLE NULL,
    `prev_main_balance` DOUBLE NULL,
    `masking_sms_count` INTEGER NULL,
    `prev_masking_sms_count` INTEGER NULL,
    `non_masking_sms_count` INTEGER NULL,
    `prev_non_masking_sms_count` INTEGER NULL,
    `masking_sms_price` DOUBLE NULL,
    `prev_masking_sms_price` DOUBLE NULL,
    `non_masking_sms_price` DOUBLE NULL,
    `prev_non_masking_sms_price` DOUBLE NULL,
    `voice_sms_balance` DOUBLE NULL,
    `prev_voice_sms_balance` DOUBLE NULL,
    `voice_sms_price` DOUBLE NULL,
    `prev_voice_sms_price` DOUBLE NULL,
    `voice_pulse_size` INTEGER NULL,
    `prev_voice_pulse_size` INTEGER NULL,
    `total_answered` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `studentFeeWiseTeacherPay` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `student_fee_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `teacher_pay_type` ENUM('percentage', 'flat') NOT NULL,
    `amount` DOUBLE NOT NULL,

    UNIQUE INDEX `studentFeeWiseTeacherPay_student_fee_id_key`(`student_fee_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `teacher_salary_structure` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `teacher_id` INTEGER NOT NULL,
    `school_id` INTEGER NOT NULL,
    `section_id` INTEGER NOT NULL,
    `subject_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `payment_type` ENUM('percentage', 'flat') NOT NULL,
    `percentage_amount` INTEGER NULL,
    `fixed_amount` INTEGER NULL,
    `deleted_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PermissionToUser` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PermissionToUser_AB_unique`(`A`, `B`),
    INDEX `_PermissionToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_RolesToPermissions` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_RolesToPermissions_AB_unique`(`A`, `B`),
    INDEX `_RolesToPermissions_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_teacher_to_seat_plan` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_teacher_to_seat_plan_AB_unique`(`A`, `B`),
    INDEX `_teacher_to_seat_plan_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SectionToTeacher` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SectionToTeacher_AB_unique`(`A`, `B`),
    INDEX `_SectionToTeacher_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_student_subjects` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_student_subjects_AB_unique`(`A`, `B`),
    INDEX `_student_subjects_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GroupToSection` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GroupToSection_AB_unique`(`A`, `B`),
    INDEX `_GroupToSection_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_WaiverFeesToStudent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_WaiverFeesToStudent_AB_unique`(`A`, `B`),
    INDEX `_WaiverFeesToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_examRoom` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_examRoom_AB_unique`(`A`, `B`),
    INDEX `_examRoom_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiscountToStudent` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiscountToStudent_AB_unique`(`A`, `B`),
    INDEX `_DiscountToStudent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_user_role_id_fkey` FOREIGN KEY (`user_role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_admin_panel_id_fkey` FOREIGN KEY (`admin_panel_id`) REFERENCES `admin_panels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_admin_panel_id_fkey` FOREIGN KEY (`admin_panel_id`) REFERENCES `admin_panels`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `schools` ADD CONSTRAINT `schools_current_academic_year_id_fkey` FOREIGN KEY (`current_academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `departments` ADD CONSTRAINT `departments_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teachers` ADD CONSTRAINT `teachers_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `classes` ADD CONSTRAINT `classes_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sections` ADD CONSTRAINT `sections_class_teacher_id_fkey` FOREIGN KEY (`class_teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_informations` ADD CONSTRAINT `student_informations_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_informations` ADD CONSTRAINT `student_informations_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_student_information_id_fkey` FOREIGN KEY (`student_information_id`) REFERENCES `student_informations`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_group_id_fkey` FOREIGN KEY (`group_id`) REFERENCES `Group`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_extra_section_id_fkey` FOREIGN KEY (`extra_section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subjects` ADD CONSTRAINT `subjects_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rooms` ADD CONSTRAINT `rooms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `periods` ADD CONSTRAINT `periods_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Group` ADD CONSTRAINT `Group_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees_head` ADD CONSTRAINT `fees_head_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fees` ADD CONSTRAINT `fees_fees_head_id_fkey` FOREIGN KEY (`fees_head_id`) REFERENCES `fees_head`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_fee_id_fkey` FOREIGN KEY (`fee_id`) REFERENCES `fees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_fees` ADD CONSTRAINT `student_fees_collected_by_fkey` FOREIGN KEY (`collected_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `holidays` ADD CONSTRAINT `holidays_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `academic_years` ADD CONSTRAINT `academic_years_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_terms` ADD CONSTRAINT `exam_terms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_terms` ADD CONSTRAINT `exam_terms_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exams` ADD CONSTRAINT `exams_exam_term_id_fkey` FOREIGN KEY (`exam_term_id`) REFERENCES `exam_terms`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_details` ADD CONSTRAINT `exam_details_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_details` ADD CONSTRAINT `exam_details_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat_plans` ADD CONSTRAINT `seat_plans_room_id_fkey` FOREIGN KEY (`room_id`) REFERENCES `rooms`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `seat_plans` ADD CONSTRAINT `seat_plans_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attendances` ADD CONSTRAINT `attendances_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `employee_attendances` ADD CONSTRAINT `employee_attendances_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_results` ADD CONSTRAINT `student_results_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_student_result_id_fkey` FOREIGN KEY (`student_result_id`) REFERENCES `student_results`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_result_details` ADD CONSTRAINT `student_result_details_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `grade_systems`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `package_transaction` ADD CONSTRAINT `package_transaction_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `package_transaction` ADD CONSTRAINT `package_transaction_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_packages` ADD CONSTRAINT `request_packages_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `request_packages` ADD CONSTRAINT `request_packages_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_package_id_fkey` FOREIGN KEY (`package_id`) REFERENCES `packages`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_history` ADD CONSTRAINT `subscription_history_edited_by_fkey` FOREIGN KEY (`edited_by`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscription_history` ADD CONSTRAINT `subscription_history_subscription_id_fkey` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `website_uis` ADD CONSTRAINT `website_uis_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_templates` ADD CONSTRAINT `sms_templates_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voice_templates` ADD CONSTRAINT `voice_templates_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_gateway` ADD CONSTRAINT `sms_gateway_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaings` ADD CONSTRAINT `sms_campaings_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaings` ADD CONSTRAINT `sms_campaings_sms_template_id_fkey` FOREIGN KEY (`sms_template_id`) REFERENCES `sms_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_campaings` ADD CONSTRAINT `sms_campaings_sms_gateway_id_fkey` FOREIGN KEY (`sms_gateway_id`) REFERENCES `sms_gateway`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_templates` ADD CONSTRAINT `email_templates_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_campaigns` ADD CONSTRAINT `email_campaigns_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `email_campaigns` ADD CONSTRAINT `email_campaigns_email_template_id_fkey` FOREIGN KEY (`email_template_id`) REFERENCES `email_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `certificate_templates` ADD CONSTRAINT `certificate_templates_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grade_systems` ADD CONSTRAINT `grade_systems_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `grade_systems` ADD CONSTRAINT `grade_systems_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vouchers` ADD CONSTRAINT `vouchers_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_method` ADD CONSTRAINT `payment_method_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_voucher_id_fkey` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_payment_method_id_fkey` FOREIGN KEY (`payment_method_id`) REFERENCES `payment_method`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `notices` ADD CONSTRAINT `notices_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_approved_by_id_fkey` FOREIGN KEY (`approved_by_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leave` ADD CONSTRAINT `Leave_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OnlineAdmission` ADD CONSTRAINT `OnlineAdmission_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeacherRecruitment` ADD CONSTRAINT `TeacherRecruitment_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Discount` ADD CONSTRAINT `Discount_fee_id_fkey` FOREIGN KEY (`fee_id`) REFERENCES `fees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_student_sent_sms_queue` ADD CONSTRAINT `tbl_student_sent_sms_queue_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_student_sent_sms_queue` ADD CONSTRAINT `tbl_student_sent_sms_queue_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_student_sent_sms_queue` ADD CONSTRAINT `tbl_student_sent_sms_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_student_sent_sms_queue` ADD CONSTRAINT `tbl_student_sent_sms_queue_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_attendance_queue` ADD CONSTRAINT `tbl_attendance_queue_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tbl_attendance_queue` ADD CONSTRAINT `tbl_attendance_queue_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `requests_buy_sms` ADD CONSTRAINT `requests_buy_sms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sms_transactions` ADD CONSTRAINT `sms_transactions_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_notes` ADD CONSTRAINT `daily_notes_period_id_fkey` FOREIGN KEY (`period_id`) REFERENCES `periods`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `daily_notes` ADD CONSTRAINT `daily_notes_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `syllabus` ADD CONSTRAINT `syllabus_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `syllabus` ADD CONSTRAINT `syllabus_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `syllabus` ADD CONSTRAINT `syllabus_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `syllabus_details` ADD CONSTRAINT `syllabus_details_syllabus_id_fkey` FOREIGN KEY (`syllabus_id`) REFERENCES `syllabus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `question` ADD CONSTRAINT `question_exam_details_id_fkey` FOREIGN KEY (`exam_details_id`) REFERENCES `exam_details`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `addtional_marking_categories` ADD CONSTRAINT `addtional_marking_categories_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_addtional_marks` ADD CONSTRAINT `exam_addtional_marks_addtional_mark_id_fkey` FOREIGN KEY (`addtional_mark_id`) REFERENCES `addtional_marking_categories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exam_addtional_marks` ADD CONSTRAINT `exam_addtional_marks_exam_id_fkey` FOREIGN KEY (`exam_id`) REFERENCES `exams`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_addtional_result_details` ADD CONSTRAINT `student_addtional_result_details_exam_addtional_mark_id_fkey` FOREIGN KEY (`exam_addtional_mark_id`) REFERENCES `exam_addtional_marks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_addtional_result_details` ADD CONSTRAINT `student_addtional_result_details_student_result_id_fkey` FOREIGN KEY (`student_result_id`) REFERENCES `student_results`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_addtional_result_details` ADD CONSTRAINT `student_addtional_result_details_grade_id_fkey` FOREIGN KEY (`grade_id`) REFERENCES `grade_systems`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homework` ADD CONSTRAINT `homework_academic_year_id_fkey` FOREIGN KEY (`academic_year_id`) REFERENCES `academic_years`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homework` ADD CONSTRAINT `homework_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `homework` ADD CONSTRAINT `homework_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `banners` ADD CONSTRAINT `banners_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `student_admission_forms` ADD CONSTRAINT `student_admission_forms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_gateway_credential` ADD CONSTRAINT `payment_gateway_credential_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment_gateway_credential` ADD CONSTRAINT `payment_gateway_credential_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `auto_attendance_sent_sms` ADD CONSTRAINT `auto_attendance_sent_sms_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `other_users_info` ADD CONSTRAINT `other_users_info_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `other_users_info` ADD CONSTRAINT `other_users_info_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `voice_gateways` ADD CONSTRAINT `voice_gateways_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `studentFeeWiseTeacherPay` ADD CONSTRAINT `studentFeeWiseTeacherPay_student_fee_id_fkey` FOREIGN KEY (`student_fee_id`) REFERENCES `student_fees`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_teacher_id_fkey` FOREIGN KEY (`teacher_id`) REFERENCES `teachers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `schools`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `teacher_salary_structure` ADD CONSTRAINT `teacher_salary_structure_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToUser` ADD CONSTRAINT `_PermissionToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PermissionToUser` ADD CONSTRAINT `_PermissionToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RolesToPermissions` ADD CONSTRAINT `_RolesToPermissions_A_fkey` FOREIGN KEY (`A`) REFERENCES `permissions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_RolesToPermissions` ADD CONSTRAINT `_RolesToPermissions_B_fkey` FOREIGN KEY (`B`) REFERENCES `Role`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacher_to_seat_plan` ADD CONSTRAINT `_teacher_to_seat_plan_A_fkey` FOREIGN KEY (`A`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_teacher_to_seat_plan` ADD CONSTRAINT `_teacher_to_seat_plan_B_fkey` FOREIGN KEY (`B`) REFERENCES `seat_plans`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToTeacher` ADD CONSTRAINT `_SectionToTeacher_A_fkey` FOREIGN KEY (`A`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SectionToTeacher` ADD CONSTRAINT `_SectionToTeacher_B_fkey` FOREIGN KEY (`B`) REFERENCES `teachers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_student_subjects` ADD CONSTRAINT `_student_subjects_A_fkey` FOREIGN KEY (`A`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_student_subjects` ADD CONSTRAINT `_student_subjects_B_fkey` FOREIGN KEY (`B`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSection` ADD CONSTRAINT `_GroupToSection_A_fkey` FOREIGN KEY (`A`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GroupToSection` ADD CONSTRAINT `_GroupToSection_B_fkey` FOREIGN KEY (`B`) REFERENCES `sections`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WaiverFeesToStudent` ADD CONSTRAINT `_WaiverFeesToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `fees`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_WaiverFeesToStudent` ADD CONSTRAINT `_WaiverFeesToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_examRoom` ADD CONSTRAINT `_examRoom_A_fkey` FOREIGN KEY (`A`) REFERENCES `exam_details`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_examRoom` ADD CONSTRAINT `_examRoom_B_fkey` FOREIGN KEY (`B`) REFERENCES `rooms`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToStudent` ADD CONSTRAINT `_DiscountToStudent_A_fkey` FOREIGN KEY (`A`) REFERENCES `Discount`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiscountToStudent` ADD CONSTRAINT `_DiscountToStudent_B_fkey` FOREIGN KEY (`B`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
