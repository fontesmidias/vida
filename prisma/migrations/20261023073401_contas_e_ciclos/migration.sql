-- DropIndex
DROP INDEX "plan_day_completions_user_id_plan_day_id_key";

-- AlterTable
ALTER TABLE "checkins" ADD COLUMN     "cycle" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "plan_day_completions" ADD COLUMN     "cycle" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_cycle" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "password_hash" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateTable
CREATE TABLE "journey_resets" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "from_cycle" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "journey_resets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journey_resets_user_id_created_at_idx" ON "journey_resets"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "checkins_user_id_cycle_created_at_idx" ON "checkins"("user_id", "cycle", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "plan_day_completions_user_id_plan_day_id_cycle_key" ON "plan_day_completions"("user_id", "plan_day_id", "cycle");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- AddForeignKey
ALTER TABLE "journey_resets" ADD CONSTRAINT "journey_resets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

