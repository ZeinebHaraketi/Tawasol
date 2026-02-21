import * as dotenv from "dotenv";
// On charge les variables AVANT d'importer le reste
dotenv.config();

import { db } from "./index";
import * as schema from "./schema";

async function main() {
  console.log("🌱 Début du seeding pour Tawasol...");

  // 1. Insertion des Universités
  // On utilise .returning() pour récupérer les IDs générés
  const insertedUnivs = await db
    .insert(schema.universities)
    .values([
      {
        name: "Université de Tunis El Manar",
        city: "Tunis",
        description: "Première université de Tunisie selon les classements.",
        website: "https://www.utm.rnu.tn",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=UTM",
      },
      {
        name: "Université de Carthage",
        city: "Carthage",
        description: "Université pluridisciplinaire d'excellence.",
        website: "https://www.ucar.rnu.tn",
        logoUrl: "https://api.dicebear.com/7.x/initials/svg?seed=UC",
      },
    ])
    .returning();

  const utmId = insertedUnivs[0].id;
  const ucarId = insertedUnivs[1].id;

  // 2. Insertion des Facultés
  await db.insert(schema.faculties).values([
    {
      universityId: utmId,
      name: "Faculté de Médecine de Tunis",
      type: "Faculté",
      address: "15 Rue Djebel Lakhdar, Tunis",
    },
    {
      universityId: ucarId,
      name: "IHEC Carthage",
      type: "Institut",
      address: "Présidence de la République, Carthage",
    },
    {
      universityId: ucarId,
      name: "École Polytechnique de Tunisie (EPT)",
      type: "École d'Ingénieurs",
      address: "La Marsa, Tunis",
    },
  ]);

  // 3. Insertion des Bourses
  await db.insert(schema.scholarships).values([
    {
      title: "Bourse nationale d'excellence",
      provider: "Ministère de l'Enseignement Supérieur",
      amount: "200 DT / mois",
      status: "ouvert",
      description: "Aide financière pour les étudiants brillants.",
    },
  ]);

  // 4. Insertion d'un Admin
  await db
    .insert(schema.users)
    .values({
      firstName: "Admin",
      lastName: "Tawasol",
      email: "admin@tawasol.tn",
      password: "password_secure_123",
      role: "admin",
      imageProfile: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    })
    .onConflictDoUpdate({
      target: schema.users.email,
      set: { updatedAt: new Date() },
    });

  console.log("✅ Seeding terminé ! (Les doublons ont été mis à jour)");
}

main().catch((err) => {
  console.error("❌ Erreur pendant le seeding :");
  console.error(err);
  process.exit(1);
});
