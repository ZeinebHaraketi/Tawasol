import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Clé API manquante" }, { status: 500 });
    }

    const mimeType = imageUrl.split(';')[0].split(':')[1];
    const base64Data = imageUrl.split(",")[1];

    // ON FORCE LA VERSION v1beta car c'est là que réside gemini-1.5-flash actuellement
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const payload = {
      contents: [
        {
          parts: [
            { text: "Tu es un expert en documents académiques tunisiens. Analyse cette image et extrais : moyenne_generale (nombre), section, mention, session. Réponds UNIQUEMENT en JSON pur." },
            {
              inline_data: {
                mime_type: mimeType,
                data: base64Data
              }
            }
          ]
        }
      ]
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("DEBUG API ERROR:", JSON.stringify(data, null, 2));
      return NextResponse.json({ error: "Erreur API", details: data }, { status: response.status });
    }

    // Extraction sécurisée du texte
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!resultText) {
      throw new Error("Aucun contenu généré par l'IA");
    }

    // Nettoyage du JSON
    const cleanJson = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanJson));

  } catch (error: any) {
    console.error("ERREUR CATCH:", error);
    return NextResponse.json({ error: "Analyse échouée", message: error.message }, { status: 500 });
  }
}