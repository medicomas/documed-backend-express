-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NOT NULL,
    `names` VARCHAR(191) NOT NULL,
    `surnames` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RolesOnUser` (
    `userId` INTEGER NOT NULL,
    `roleId` INTEGER NOT NULL,

    PRIMARY KEY (`userId`, `roleId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id_User` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_id_User_key`(`id_User`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id_User` INTEGER NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `gender` CHAR(1) NOT NULL,

    UNIQUE INDEX `Doctor_id_User_key`(`id_User`),
    UNIQUE INDEX `Doctor_document_key`(`document`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Patient` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `names` VARCHAR(191) NOT NULL,
    `surnames` VARCHAR(191) NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `gender` CHAR(1) NOT NULL,

    UNIQUE INDEX `Patient_document_key`(`document`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_doctor` INTEGER NOT NULL,
    `id_patient` INTEGER NOT NULL,
    `has_ended` BOOLEAN NOT NULL DEFAULT false,
    `hour` DATETIME(3) NOT NULL,
    `anamnesis` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PreviousDisease` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_diagnose` INTEGER NOT NULL,
    `ICD10_code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diagnose` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_patient` INTEGER NOT NULL,
    `id_appointment` INTEGER NOT NULL,
    `id_previousDisease` INTEGER NOT NULL,
    `ICD10_code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_diagnose` INTEGER NOT NULL,
    `medication` VARCHAR(191) NOT NULL,
    `dose` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_medico` INTEGER NOT NULL,
    `id_diagnostico` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RolesOnUser` ADD CONSTRAINT `RolesOnUser_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RolesOnUser` ADD CONSTRAINT `RolesOnUser_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `UserRole`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_id_User_fkey` FOREIGN KEY (`id_User`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_id_User_fkey` FOREIGN KEY (`id_User`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id_User`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointments` ADD CONSTRAINT `Appointments_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PreviousDisease` ADD CONSTRAINT `PreviousDisease_id_diagnose_fkey` FOREIGN KEY (`id_diagnose`) REFERENCES `Diagnose`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnose` ADD CONSTRAINT `Diagnose_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Diagnose` ADD CONSTRAINT `Diagnose_id_appointment_fkey` FOREIGN KEY (`id_appointment`) REFERENCES `Appointments`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_id_diagnose_fkey` FOREIGN KEY (`id_diagnose`) REFERENCES `Diagnose`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalHistory` ADD CONSTRAINT `MedicalHistory_id_medico_fkey` FOREIGN KEY (`id_medico`) REFERENCES `Doctor`(`id_User`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalHistory` ADD CONSTRAINT `MedicalHistory_id_diagnostico_fkey` FOREIGN KEY (`id_diagnostico`) REFERENCES `Diagnose`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
