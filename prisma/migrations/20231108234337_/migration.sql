/*
  Warnings:

  - You are about to drop the `MedicalHistory` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `abdomen_y_pelvis` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ano_y_recto` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `aspecto_general` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cabeza_y_cuello` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cardiovascular` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cavidad_oral` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `genito_urinario` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `locomotor` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.
  - Made the column `neurologico` on table `PhysicalExploration` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `MedicalHistory` DROP FOREIGN KEY `MedicalHistory_id_diagnostico_fkey`;

-- DropForeignKey
ALTER TABLE `MedicalHistory` DROP FOREIGN KEY `MedicalHistory_id_doctor_fkey`;

-- AlterTable
ALTER TABLE `PhysicalExploration` MODIFY `abdomen_y_pelvis` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `ano_y_recto` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `aspecto_general` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `cabeza_y_cuello` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `cardiovascular` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `cavidad_oral` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `genito_urinario` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `locomotor` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `neurologico` VARCHAR(191) NOT NULL DEFAULT '';

-- DropTable
DROP TABLE `MedicalHistory`;
