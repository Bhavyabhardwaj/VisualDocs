-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "public"."ProgrammingLanguage" AS ENUM ('typescript', 'javascript', 'python', 'java', 'csharp', 'cpp', 'php', 'ruby', 'go');

-- CreateEnum
CREATE TYPE "public"."ProjectStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "public"."ProjectVisibility" AS ENUM ('PRIVATE', 'PUBLIC', 'TEAM');

-- CreateEnum
CREATE TYPE "public"."DiagramType" AS ENUM ('ARCHITECTURE', 'FLOWCHART', 'SEQUENCE', 'CLASS', 'ER', 'COMPONENT');

-- CreateEnum
CREATE TYPE "public"."DiagramStyle" AS ENUM ('MODERN', 'MINIMALIST', 'DETAILED', 'COLORFUL');

-- CreateEnum
CREATE TYPE "public"."DiagramStatus" AS ENUM ('PENDING', 'GENERATING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "language" "public"."ProgrammingLanguage" NOT NULL,
    "framework" TEXT,
    "status" "public"."ProjectStatus" NOT NULL DEFAULT 'ACTIVE',
    "visibility" "public"."ProjectVisibility" NOT NULL DEFAULT 'PRIVATE',
    "settings" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."code_files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "encoding" TEXT NOT NULL DEFAULT 'utf-8',
    "ast" JSONB,
    "metadata" JSONB,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "code_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."analyses" (
    "id" TEXT NOT NULL,
    "totalFiles" INTEGER NOT NULL,
    "totalLinesOfCode" INTEGER NOT NULL,
    "totalComplexity" INTEGER NOT NULL,
    "averageComplexity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "functionCount" INTEGER NOT NULL DEFAULT 0,
    "classCount" INTEGER NOT NULL DEFAULT 0,
    "interfaceCount" INTEGER NOT NULL DEFAULT 0,
    "languageDistribution" JSONB NOT NULL,
    "frameworksDetected" TEXT[],
    "dependencies" JSONB NOT NULL,
    "recommendations" TEXT[],
    "metrics" JSONB,
    "projectId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."diagrams" (
    "id" TEXT NOT NULL,
    "type" "public"."DiagramType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT,
    "imageData" TEXT,
    "style" "public"."DiagramStyle" NOT NULL DEFAULT 'MODERN',
    "format" TEXT NOT NULL DEFAULT 'png',
    "dimensions" JSONB,
    "status" "public"."DiagramStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "metadata" JSONB,
    "generationTime" INTEGER,
    "projectId" TEXT NOT NULL,
    "codeFileId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagrams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."sessions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastActivity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "collaborators" JSONB NOT NULL DEFAULT '[]',
    "settings" JSONB,
    "userId" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "public"."projects"("userId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "public"."projects"("status");

-- CreateIndex
CREATE INDEX "projects_createdAt_idx" ON "public"."projects"("createdAt");

-- CreateIndex
CREATE INDEX "code_files_projectId_idx" ON "public"."code_files"("projectId");

-- CreateIndex
CREATE INDEX "code_files_hash_idx" ON "public"."code_files"("hash");

-- CreateIndex
CREATE INDEX "code_files_language_idx" ON "public"."code_files"("language");

-- CreateIndex
CREATE UNIQUE INDEX "analyses_projectId_key" ON "public"."analyses"("projectId");

-- CreateIndex
CREATE INDEX "analyses_completedAt_idx" ON "public"."analyses"("completedAt");

-- CreateIndex
CREATE INDEX "diagrams_projectId_idx" ON "public"."diagrams"("projectId");

-- CreateIndex
CREATE INDEX "diagrams_type_idx" ON "public"."diagrams"("type");

-- CreateIndex
CREATE INDEX "diagrams_status_idx" ON "public"."diagrams"("status");

-- CreateIndex
CREATE INDEX "diagrams_createdAt_idx" ON "public"."diagrams"("createdAt");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "public"."sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_projectId_idx" ON "public"."sessions"("projectId");

-- CreateIndex
CREATE INDEX "sessions_isActive_idx" ON "public"."sessions"("isActive");

-- AddForeignKey
ALTER TABLE "public"."projects" ADD CONSTRAINT "projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."code_files" ADD CONSTRAINT "code_files_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."analyses" ADD CONSTRAINT "analyses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."diagrams" ADD CONSTRAINT "diagrams_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."diagrams" ADD CONSTRAINT "diagrams_codeFileId_fkey" FOREIGN KEY ("codeFileId") REFERENCES "public"."code_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."sessions" ADD CONSTRAINT "sessions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
