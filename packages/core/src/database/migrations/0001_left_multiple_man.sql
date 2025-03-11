CREATE INDEX "passkey_credential_user_id_idx" ON "passkey_credential" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_user_id_idx" ON "session" USING btree ("user_id");