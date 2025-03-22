CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text DEFAULT '' NOT NULL,
	"avatar_url" text,
	"email_verified" boolean DEFAULT false NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_verification_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	CONSTRAINT "email_verification_request_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "oauth_account" (
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"provider_user_id" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "oauth_account_provider_id_provider_user_id_pk" PRIMARY KEY("provider_id","provider_user_id"),
	CONSTRAINT "oauth_account_providerUserID_unique" UNIQUE("provider_user_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passkey_credential" (
	"id" "bytea" PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"algorithm" integer NOT NULL,
	"public_key" "bytea" NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscription" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"status" text NOT NULL,
	"customer_id" text NOT NULL,
	"price_id" text NOT NULL,
	"product_id" text NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "subscription_user_id_product_id_idx" UNIQUE("user_id","product_id")
);
--> statement-breakpoint
ALTER TABLE "email_verification_request" ADD CONSTRAINT "email_verification_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "oauth_account" ADD CONSTRAINT "oauth_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey_credential" ADD CONSTRAINT "passkey_credential_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "user" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_verification_request_user_id_idx" ON "email_verification_request" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_credential_user_id_idx" ON "passkey_credential" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "subscription_user_id_idx" ON "subscription" USING btree ("user_id");