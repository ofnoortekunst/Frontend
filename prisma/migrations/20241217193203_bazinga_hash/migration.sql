/*
  Warnings:

  - A unique constraint covering the columns `[Hash]` on the table `Art` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Art` ADD COLUMN `Hash` VARCHAR(191) NOT NULL DEFAULT 'none';

-- CreateIndex
CREATE UNIQUE INDEX `Art_Hash_key` ON `Art`(`Hash`);
