-- CreateTable
CREATE TABLE `User` (
    `User_id` VARCHAR(191) NOT NULL,
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Grade` VARCHAR(191) NULL DEFAULT 'none',
    `Language` VARCHAR(191) NULL DEFAULT 'et',
    `LightPreference` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_User_id_key`(`User_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Art` (
    `Title` VARCHAR(191) NOT NULL,
    `Likes` INTEGER NOT NULL DEFAULT 0,
    `ImageReference` VARCHAR(191) NOT NULL,
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Description` VARCHAR(191) NULL,
    `Published` BOOLEAN NOT NULL DEFAULT true,
    `AuthorId` VARCHAR(191) NOT NULL,
    `Technique` VARCHAR(191) NOT NULL DEFAULT 'muu',
    `Size` VARCHAR(191) NOT NULL,
    `Price` DECIMAL(65, 30) NOT NULL DEFAULT 0,
    `Orientation` VARCHAR(191) NOT NULL,
    `Year` INTEGER NOT NULL DEFAULT 2024,
    `UploadDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdateDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserFollowing` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserFollowing_AB_unique`(`A`, `B`),
    INDEX `_UserFollowing_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserLikes` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserLikes_AB_unique`(`A`, `B`),
    INDEX `_UserLikes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Art` ADD CONSTRAINT `Art_AuthorId_fkey` FOREIGN KEY (`AuthorId`) REFERENCES `User`(`User_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollowing` ADD CONSTRAINT `_UserFollowing_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollowing` ADD CONSTRAINT `_UserFollowing_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserLikes` ADD CONSTRAINT `_UserLikes_A_fkey` FOREIGN KEY (`A`) REFERENCES `Art`(`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserLikes` ADD CONSTRAINT `_UserLikes_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
