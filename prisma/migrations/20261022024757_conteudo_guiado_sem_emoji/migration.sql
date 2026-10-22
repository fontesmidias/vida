-- AlterTable
ALTER TABLE "daily_contents" ADD COLUMN     "practice_kind" TEXT NOT NULL DEFAULT 'breath';

-- AlterTable
ALTER TABLE "moods" DROP COLUMN "emoji";

