/*
  Warnings:

  - The primary key for the `CommentsOnPosts` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "CommentsOnPosts" DROP CONSTRAINT "CommentsOnPosts_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "CommentsOnPosts_pkey" PRIMARY KEY ("id");
