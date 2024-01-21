/*
  Warnings:

  - A unique constraint covering the columns `[guildId,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Project_guildId_name_key" ON "Project"("guildId", "name");
