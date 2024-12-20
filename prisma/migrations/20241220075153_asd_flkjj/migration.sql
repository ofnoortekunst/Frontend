-- AlterTable
ALTER TABLE `User` ADD COLUMN `ContactGmail` VARCHAR(191) NULL,
    ADD COLUMN `ContactInstagram` VARCHAR(191) NULL,
    ADD COLUMN `ContactPreference` VARCHAR(191) NULL DEFAULT 'gmail',
    ADD COLUMN `ContactTikTok` VARCHAR(191) NULL;
