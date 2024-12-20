/*
  Warnings:

  - You are about to drop the column `ContactGmail` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ContactInstagram` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `ContactTikTok` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `ContactGmail`,
    DROP COLUMN `ContactInstagram`,
    DROP COLUMN `ContactTikTok`,
    ADD COLUMN `Contact` VARCHAR(191) NULL;
