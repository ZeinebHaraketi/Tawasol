import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- 1. DÉFINITION DES ENUMS (TYPES ÉNUMÉRÉS) ---

// Rôles des utilisateurs pour la sécurité et les accès
export const userRoleEnum = pgEnum("user_role", [
  "student",
  "admin",
  "professor",
]);

// Statuts des bourses et événements
export const statusEnum = pgEnum("status", ["ouvert", "ferme", "bientot"]);

// Statuts des candidatures (Applications)
export const applicationStatusEnum = pgEnum("application_status", [
  "en_attente",
  "valide",
  "refuse",
]);

// --- 2. TABLES DES UTILISATEURS ---

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(), // 👈 Ajoute cette ligne
  firstName: text("first_name"),
  lastName: text("last_name"),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  image: text("image"), // Rôle : student par défaut
  role: userRoleEnum("role").default("student").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// --- 3. TABLES DU SYSTÈME UNIVERSITAIRE ---

// Table des Universités (ex: Université de Carthage)
export const universities = pgTable("universities", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  city: varchar("city", { length: 100 }).notNull(), // Tunis, Sousse, etc.
  description: text("description"),
  website: text("website"),
  logoUrl: text("logo_url"),
  isPublic: boolean("is_public").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Table des Facultés/Écoles (ex: IHEC, ENIT, Faculté de Médecine)
export const faculties = pgTable("faculties", {
  id: text("id").primaryKey(),
  universityId: text("university_id").references(() => universities.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  type: varchar("type", { length: 100 }), // Faculté, Institut, Ecole d'Ingénieurs
  address: text("address"),
});

// --- 4. TABLES DES RESSOURCES (BOURSES & ÉVÉNEMENTS) ---

// Table des Bourses d'études
export const scholarships = pgTable("scholarships", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(), // ex: Ministère, Ambassade de France, etc.
  amount: varchar("amount", { length: 100 }),
  deadline: timestamp("deadline"),
  description: text("description"),
  eligibility: text("eligibility"),
  status: statusEnum("status").default("ouvert"),
  applyLink: text("apply_link"),
});

// Table des Événements (Salons de l'étudiant, JPO)
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

// --- 5. TABLE DES CANDIDATURES (LIAISON ÉTUDIANT - FACULTÉ) ---

export const applications = pgTable("applications", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  facultyId: text("faculty_id").references(() => faculties.id, {
    onDelete: "cascade",
  }),

  // Utilise l'Enum pour garantir la cohérence des statuts
  status: applicationStatusEnum("status").default("en_attente"),

  submittedAt: timestamp("submitted_at").defaultNow(),
  notes: text("notes"), // Pour d'éventuels retours de l'admin/professeur
});

// Relations pour la table Users
export const usersRelations = relations(users, ({ many }) => ({
  applications: many(applications),
}));

// Relations pour la table Applications
export const applicationsRelations = relations(applications, ({ one }) => ({
  userId: one(users, {
    fields: [applications.userId],
    references: [users.id],
  }),
  facultyId: one(faculties, {
    fields: [applications.facultyId],
    references: [faculties.id],
  }),
}));

// Relations pour la table Faculties
export const facultiesRelations = relations(faculties, ({ one, many }) => ({
  university: one(universities, {
    fields: [faculties.universityId],
    references: [universities.id],
  }),
  applications: many(applications),
}));

// --- TABLES TECHNIQUES POUR BETTER AUTH ---

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
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
