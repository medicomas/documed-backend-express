-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `hashed_password` VARCHAR(191) NOT NULL,
    `names` VARCHAR(191) NOT NULL,
    `surnames` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserRole` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `id_user` INTEGER NOT NULL,

    UNIQUE INDEX `Admin_id_user_key`(`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Doctor` (
    `id_user` INTEGER NOT NULL,
    `documentType` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `gender` CHAR(1) NOT NULL,

    UNIQUE INDEX `Doctor_id_user_key`(`id_user`),
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
    `phone_number` VARCHAR(191) NOT NULL,
    `birthdate` DATE NULL,

    UNIQUE INDEX `Patient_document_key`(`document`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_doctor` INTEGER NOT NULL,
    `id_patient` INTEGER NOT NULL,
    `has_ended` BOOLEAN NOT NULL DEFAULT false,
    `date` DATETIME(3) NOT NULL,
    `anamnesis` VARCHAR(191) NOT NULL,
    `id_workplan` INTEGER NOT NULL,
    `id_vitalsigns` INTEGER NOT NULL,
    `id_physicalexploration` INTEGER NOT NULL,

    UNIQUE INDEX `Appointment_id_workplan_key`(`id_workplan`),
    UNIQUE INDEX `Appointment_id_vitalsigns_key`(`id_vitalsigns`),
    UNIQUE INDEX `Appointment_id_physicalexploration_key`(`id_physicalexploration`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VitalSigns` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `presion_arterial` DOUBLE NULL,
    `temperatura` DOUBLE NULL,
    `frecuencia_respiratoria` DOUBLE NULL,
    `frecuencia_cardiaca` DOUBLE NULL,
    `peso` DOUBLE NULL,
    `talla` DOUBLE NULL,
    `imc` DOUBLE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PhysicalExploration` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `abdomen_y_pelvis` VARCHAR(191) NULL,
    `ano_y_recto` VARCHAR(191) NULL,
    `aspecto_general` VARCHAR(191) NULL,
    `cabeza_y_cuello` VARCHAR(191) NULL,
    `cardiovascular` VARCHAR(191) NULL,
    `cavidad_oral` VARCHAR(191) NULL,
    `genito_urinario` VARCHAR(191) NULL,
    `locomotor` VARCHAR(191) NULL,
    `neurologico` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `indications` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diagnose` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_workplan` INTEGER NOT NULL,
    `ICD10_code` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Treatment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_appointment` INTEGER NOT NULL,
    `id_workplan` INTEGER NOT NULL,
    `medication` VARCHAR(191) NOT NULL,
    `dose` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `id_doctor` INTEGER NOT NULL,
    `id_diagnostico` INTEGER NOT NULL,
    `date` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserToUserRole` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_UserToUserRole_AB_unique`(`A`, `B`),
    INDEX `_UserToUserRole_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Admin` ADD CONSTRAINT `Admin_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Doctor` ADD CONSTRAINT `Doctor_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_vitalsigns_fkey` FOREIGN KEY (`id_vitalsigns`) REFERENCES `VitalSigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_physicalexploration_fkey` FOREIGN KEY (`id_physicalexploration`) REFERENCES `PhysicalExploration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_workplan_fkey` FOREIGN KEY (`id_workplan`) REFERENCES `WorkPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalHistory` ADD CONSTRAINT `MedicalHistory_id_doctor_fkey` FOREIGN KEY (`id_doctor`) REFERENCES `Doctor`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalHistory` ADD CONSTRAINT `MedicalHistory_id_diagnostico_fkey` FOREIGN KEY (`id_diagnostico`) REFERENCES `Diagnose`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToUserRole` ADD CONSTRAINT `_UserToUserRole_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserToUserRole` ADD CONSTRAINT `_UserToUserRole_B_fkey` FOREIGN KEY (`B`) REFERENCES `UserRole`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
