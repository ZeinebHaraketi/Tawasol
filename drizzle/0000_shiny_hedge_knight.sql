CREATE TYPE "public"."application_status" AS ENUM('en_attente', 'valide', 'refuse');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ouvert', 'ferme', 'bientot');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'admin', 'professor');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"faculty_id" integer,
	"status" "application_status" DEFAULT 'en_attente',
	"submitted_at" timestamp DEFAULT now(),
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"location" text NOT NULL,
	"event_date" timestamp NOT NULL,
	"description" text,
	"image_url" text,
	"organizer" text,
	"is_virtual" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "faculties" (
	"id" serial PRIMARY KEY NOT NULL,
	"university_id" integer,
	"name" text NOT NULL,
	"type" varchar(100),
	"address" text
);
--> statement-breakpoint
CREATE TABLE "scholarships" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"provider" text NOT NULL,
	"amount" varchar(100),
	"deadline" timestamp,
	"description" text,
	"eligibility" text,
	"status" "status" DEFAULT 'ouvert',
	"apply_link" text
);
--> statement-breakpoint
CREATE TABLE "universities" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"city" varchar(100) NOT NULL,
	"description" text,
	"website" text,
	"logo_url" text,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_faculty_id_faculties_id_fk" FOREIGN KEY ("faculty_id") REFERENCES "public"."faculties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "faculties" ADD CONSTRAINT "faculties_university_id_universities_id_fk" FOREIGN KEY ("university_id") REFERENCES "public"."universities"("id") ON DELETE cascade ON UPDATE no action;