import {
  pgTable,
  text,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- 1. DÉFINITION DES ENUMS ---

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "admin",
  "professor",
]);

export const statusEnum = pgEnum("status", ["ouvert", "ferme", "bientot"]);

export const applicationStatusEnum = pgEnum("application_status", [
  "en_attente",
  "valide",
  "refuse",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "en_attente",
  "valide",
  "rejete",
]);

// --- 2. TABLES DES UTILISATEURS ---

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  image: text("image"),
  role: userRoleEnum("role").default("student").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 3. TABLES DU SYSTÈME UNIVERSITAIRE ---

export const universities = pgTable("universities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  description: text("description"),
  website: text("website"),
  logoUrl: text("logo_url"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faculties = pgTable("faculties", {
  id: text("id").primaryKey(),
  universityId: text("university_id").references(() => universities.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  type: varchar("type", { length: 100 }),
  address: text("address"),
});

// --- 4. TABLES DES RESSOURCES ---

export const scholarships = pgTable("scholarships", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  amount: varchar("amount", { length: 100 }),
  deadline: timestamp("deadline"),
  description: text("description"),
  eligibility: text("eligibility"),
  status: statusEnum("status").default("ouvert"),
  applyLink: text("apply_link"),
});

export const events = pgTable("events", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  location: text("location").notNull(),
  eventDate: timestamp("event_date").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  organizer: text("organizer"),
  isVirtual: boolean("is_virtual").default(false),
});

// --- 5. TABLE DES CANDIDATURES ---

export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  facultyId: text("faculty_id").references(() => faculties.id, {
    onDelete: "cascade",
  }),
  status: applicationStatusEnum("status").default("en_attente"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  notes: text("notes"),
});

// --- 6. TABLE DES DOCUMENTS ---

export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), 
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name"),
  status: documentStatusEnum("status").default("en_attente"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 7. DÉFINITION DES RELATIONS ---

// Fusion de toutes les relations pour la table Users
export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
  documents: many(documents),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  user: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  faculty: one(faculties, {
    fields: [applications.facultyId],
    references: [faculties.id],
  }),
}));

export const facultiesRelations = relations(faculties, ({ one, many }) => ({
  university: one(universities, {
    fields: [faculties.universityId],
    references: [universities.id],
  }),
  applications: many(applications),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

// --- 8. TABLES TECHNIQUES POUR BETTER AUTH ---

export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});