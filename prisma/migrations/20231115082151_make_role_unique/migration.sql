/*
  Warnings:

  - You are about to drop the column `anamnesis` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `has_ended` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `id_physicalexploration` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `id_vitalsigns` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `id_workplan` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_id_physicalexploration_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_id_vitalsigns_fkey`;

-- DropForeignKey
ALTER TABLE `Appointment` DROP FOREIGN KEY `Appointment_id_workplan_fkey`;

-- AlterTable
ALTER TABLE `Appointment` DROP COLUMN `anamnesis`,
    DROP COLUMN `has_ended`,
    DROP COLUMN `id_physicalexploration`,
    DROP COLUMN `id_vitalsigns`,
    DROP COLUMN `id_workplan`,
    ADD COLUMN `has_attended` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `date` DATE NOT NULL;

-- CreateTable
CREATE TABLE `Consultation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `anamnesis` VARCHAR(191) NOT NULL,
    `id_appointment` INTEGER NOT NULL,
    `id_vitalsigns` INTEGER NOT NULL,
    `id_physicalexploration` INTEGER NOT NULL,
    `id_workplan` INTEGER NOT NULL,

    UNIQUE INDEX `Consultation_id_appointment_key`(`id_appointment`),
    UNIQUE INDEX `Consultation_id_vitalsigns_key`(`id_vitalsigns`),
    UNIQUE INDEX `Consultation_id_physicalexploration_key`(`id_physicalexploration`),
    UNIQUE INDEX `Consultation_id_workplan_key`(`id_workplan`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MedicalAntecedent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `id_patient` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `UserRole_name_key` ON `UserRole`(`name`);

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_id_appointment_fkey` FOREIGN KEY (`id_appointment`) REFERENCES `Appointment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_id_vitalsigns_fkey` FOREIGN KEY (`id_vitalsigns`) REFERENCES `VitalSigns`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_id_physicalexploration_fkey` FOREIGN KEY (`id_physicalexploration`) REFERENCES `PhysicalExploration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Consultation` ADD CONSTRAINT `Consultation_id_workplan_fkey` FOREIGN KEY (`id_workplan`) REFERENCES `WorkPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MedicalAntecedent` ADD CONSTRAINT `MedicalAntecedent_id_patient_fkey` FOREIGN KEY (`id_patient`) REFERENCES `Patient`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
