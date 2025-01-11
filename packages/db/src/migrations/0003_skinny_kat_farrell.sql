ALTER TABLE "oauth_account" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_account" ADD COLUMN "updated_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "passkey_credential" ADD COLUMN "created_at" timestamp NOT NULL;--> statement-breakpoint
ALTER TABLE "passkey_credential" ADD COLUMN "updated_at" timestamp NOT NULL;