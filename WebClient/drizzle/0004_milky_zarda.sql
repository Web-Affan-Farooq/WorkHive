ALTER TABLE "Tasks" RENAME COLUMN "task_id" TO "organization_id";--> statement-breakpoint
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_task_id_Organizations_id_fk";
--> statement-breakpoint
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_organization_id_Organizations_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."Organizations"("id") ON DELETE cascade ON UPDATE no action;