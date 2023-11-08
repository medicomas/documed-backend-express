/*
  Warnings:

  - You are about to drop the column `id_appointment` on the `Treatment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Treatment` DROP COLUMN `id_appointment`;

-- AddForeignKey
ALTER TABLE `Diagnose` ADD CONSTRAINT `Diagnose_id_workplan_fkey` FOREIGN KEY (`id_workplan`) REFERENCES `WorkPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Treatment` ADD CONSTRAINT `Treatment_id_workplan_fkey` FOREIGN KEY (`id_workplan`) REFERENCES `WorkPlan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
