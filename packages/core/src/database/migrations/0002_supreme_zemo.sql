ALTER TABLE "user" ALTER COLUMN "email" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET DEFAULT '';--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "name" SET NOT NULL;