-- custom sql import ...
-- enable gen_random_uuid() if you use defaultRandom() for uuid
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


CREATE TABLE "Comments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" varchar(350) NOT NULL,
	"task_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "Comments_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "Departments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar,
	"organizationId" uuid NOT NULL
);
--> statement-breakpoint


-- create enum before the table (custom sql code)
DO $$ BEGIN
  CREATE TYPE "NotificationType" AS ENUM ('SUCCESS', 'FAILURE', 'REMINDER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"message" varchar(255) NOT NULL,
	"type" "NotificationType" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Organizations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"organizationEmail" varchar(30) NOT NULL,
	"organizationPassword" text NOT NULL,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tasks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(255) NOT NULL,
	"assigned_on" timestamp with time zone DEFAULT now() NOT NULL,
	"due_date" timestamp with time zone NOT NULL,
	"completed" boolean NOT NULL,
	"completed_on" timestamp,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "user_departments" (
	"user_id" uuid NOT NULL,
	"department_id" uuid NOT NULL,
	CONSTRAINT "user_departments_user_id_department_id_pk" PRIMARY KEY("user_id","department_id")
);
--> statement-breakpoint
CREATE TABLE "user_tasks" (
	"user_id" uuid NOT NULL,
	"task_id" uuid NOT NULL,
	CONSTRAINT "user_tasks_user_id_task_id_pk" PRIMARY KEY("user_id","task_id")
);

-- create plan enum before the table (custom sql code)
DO $$ BEGIN
  CREATE TYPE "Plan" AS ENUM ('FREE', 'TEAMS', 'PRO');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

--> statement-breakpoint
CREATE TABLE "Accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"plan" "Plan" DEFAULT 'FREE' NOT NULL,
	"stripe_customer_id" varchar(255),
	"stripe_sub_id" varchar(255),
	CONSTRAINT "Accounts_email_unique" UNIQUE("email"),
	CONSTRAINT "Accounts_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "Accounts_stripe_sub_id_unique" UNIQUE("stripe_sub_id")
);
--> statement-breakpoint
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_task_id_Tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."Tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_user_id_Accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_user_id_Accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_department_id_Departments_id_fk" FOREIGN KEY ("department_id") REFERENCES "public"."Departments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_user_id_Accounts_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_tasks" ADD CONSTRAINT "user_tasks_task_id_Tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."Tasks"("id") ON DELETE cascade ON UPDATE no action;