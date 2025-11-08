ALTER TABLE "Departments" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "Accounts" ADD COLUMN "is_paid" boolean DEFAULT false;