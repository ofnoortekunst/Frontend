/*
  Warnings:

  - You are about to drop the column `OtherPind` on the `Art` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Art` DROP COLUMN `OtherPind`,
    ADD COLUMN `OtherSize` VARCHAR(191) NULL,
    MODIFY `Pind` VARCHAR(191) NOT NULL DEFAULT 'Paber';
