-- CreateTable
CREATE TABLE "ai_code_analyses" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "totalIssues" INTEGER NOT NULL DEFAULT 0,
    "criticalIssues" INTEGER NOT NULL DEFAULT 0,
    "highIssues" INTEGER NOT NULL DEFAULT 0,
    "mediumIssues" INTEGER NOT NULL DEFAULT 0,
    "lowIssues" INTEGER NOT NULL DEFAULT 0,
    "issues" JSONB NOT NULL,
    "summary" TEXT NOT NULL,
    "analyzedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ai_code_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ignored_issues" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ignoredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ignored_issues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applied_fixes" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalCode" TEXT NOT NULL,
    "fixCode" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applied_fixes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_code_analyses_projectId_idx" ON "ai_code_analyses"("projectId");

-- CreateIndex
CREATE INDEX "ai_code_analyses_analyzedAt_idx" ON "ai_code_analyses"("analyzedAt");

-- CreateIndex
CREATE INDEX "ignored_issues_projectId_idx" ON "ignored_issues"("projectId");

-- CreateIndex
CREATE INDEX "ignored_issues_userId_idx" ON "ignored_issues"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ignored_issues_projectId_issueId_userId_key" ON "ignored_issues"("projectId", "issueId", "userId");

-- CreateIndex
CREATE INDEX "applied_fixes_projectId_idx" ON "applied_fixes"("projectId");

-- CreateIndex
CREATE INDEX "applied_fixes_userId_idx" ON "applied_fixes"("userId");

-- CreateIndex
CREATE INDEX "applied_fixes_fileId_idx" ON "applied_fixes"("fileId");
