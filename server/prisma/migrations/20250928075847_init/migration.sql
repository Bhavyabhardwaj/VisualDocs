-- CreateEnum
CREATE TYPE "public"."AuthProvider" AS ENUM ('EMAIL', 'GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "public"."projects" ADD COLUMN     "githubBranch" TEXT,
ADD COLUMN     "githubForks" INTEGER,
ADD COLUMN     "githubImportedAt" TIMESTAMP(3),
ADD COLUMN     "githubLanguage" TEXT,
ADD COLUMN     "githubRepo" TEXT,
ADD COLUMN     "githubStars" INTEGER,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "importedFromGitHub" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."users" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "provider" "public"."AuthProvider",
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "users_providerId_idx" ON "public"."users"("providerId");
