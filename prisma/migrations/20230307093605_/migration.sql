-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('USER', 'OWNER');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" SERIAL NOT NULL,
    "authorId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "point" INTEGER NOT NULL DEFAULT 0,
    "voteStatus" INTEGER NOT NULL DEFAULT 0,
    "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,
    "subredditId" INTEGER,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Updoot" (
    "id" SERIAL NOT NULL,
    "value" INTEGER NOT NULL,
    "postId" INTEGER,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Updoot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subreddit" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "Subreddit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Memberships" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "subredditId" INTEGER NOT NULL,
    "role" "MemberRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "Memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_email_key" ON "User"("username", "email");

-- CreateIndex
CREATE UNIQUE INDEX "Subreddit_name_key" ON "Subreddit"("name");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updoot" ADD CONSTRAINT "Updoot_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Updoot" ADD CONSTRAINT "Updoot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memberships" ADD CONSTRAINT "Memberships_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Memberships" ADD CONSTRAINT "Memberships_subredditId_fkey" FOREIGN KEY ("subredditId") REFERENCES "Subreddit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
