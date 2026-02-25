import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./index";
import * as schema from "./schema";

// db/auth.ts
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      firstName: { type: "string", mapTo: "first_name" },
      lastName: { type: "string", mapTo: "last_name" },
      role: { type: "string", mapTo: "role" },
    },
  },

  socialProviders: {
    // 👈 Ajoute ce bloc
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Si le nom existe mais que first_name/last_name sont vides (cas de Google)
          if (user.name && (!user.firstName || !user.lastName)) {
            const parts = user.name.split(" ");
            const firstName = parts[0];
            const lastName = parts.slice(1).join(" ") || ""; // Gère les noms composés

            return {
              data: {
                ...user,
                firstName: firstName,
                lastName: lastName,
              },
            };
          }
        },
      },
    },
  },
});
