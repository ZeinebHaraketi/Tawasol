import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/db/auth"; // Ton import Better Auth
import { db } from "@/db"; // Ton instance Neon/Drizzle (souvent db ou dbi)
import { documents } from "@/db/schema"; // Ton schéma Drizzle
import { and, eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    // 1. Vérifier la session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return new NextResponse("Non autorisé", { status: 401 });
    }

    // const { type, fileUrl, fileName } = await req.json();

    const body = await req.json().catch(() => null);
    const { type, fileUrl, fileName } = body ?? {};

    if (
    typeof type !== "string" ||
      type.length === 0 ||
      type.length > 50 ||
      typeof fileUrl !== "string" ||
      fileUrl.length === 0 ||
      (fileName != null && typeof fileName !== "string")
    ) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    // 2. Logique Upsert manuelle avec Drizzle
    // On cherche si le document existe déjà pour ce type ET cet utilisateur
    const existingDoc = await db.query.documents.findFirst({
      where: and(
        eq(documents.userId, session.user.id),
        eq(documents.type, type),
      ),
    });

    let result;

    if (existingDoc) {
      // UPDATE
      result = await db
        .update(documents)
        .set({
          fileUrl: fileUrl,
          fileName: fileName,
          status: "en_attente", // On remet en attente si le fichier change
          updatedAt: new Date(),
        })
        .where(eq(documents.id, existingDoc.id))
        .returning();
    } else {
      // INSERT
      result = await db
        .insert(documents)
        .values({
          id: uuidv4(), // Génère un ID unique
          userId: session.user.id,
          type: type,
          fileUrl: fileUrl,
          fileName: fileName,
          status: "en_attente",
        })
        .returning();
    }

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}



