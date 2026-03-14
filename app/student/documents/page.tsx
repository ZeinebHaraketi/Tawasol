"use client";

import { useState, useMemo } from "react";
import {
  FileText,
  CheckCircle,
  Upload,
  Trash2,
  FileCheck,
  Eye,
  X,
  AlertCircle,
  Send,
  Sparkles,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const REQUIRED_DOCS = [
  {
    id: "cin",
    name: "Carte d'Identité Nationale (CIN)",
    description: "Copie recto-verso nette",
  },
  {
    id: "bac_diploma",
    name: "Diplôme du Baccalauréat",
    description: "Attestation de réussite ou diplôme (Arabe ou FR)",
  },
  {
    id: "bac_transcript",
    name: "Relevé de notes du Bac",
    description: "Le relevé officiel avec cachet",
  },
  {
    id: "diploma",
    name: "Dernier Diplôme obtenu",
    description: "Si applicable (Licence, etc.)",
  },
];

export default function DocumentsPage() {
  const [uploads, setUploads] = useState<
    Record<string, { name: string; url: string }>
  >({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<{
    moyenne: number;
    serie: string;
    mention: string;
  } | null>(null);

  // Calcul de progression mémoïsé
  const stats = useMemo(() => {
    const uploadedCount = Object.keys(uploads).length;
    const totalCount = REQUIRED_DOCS.length;
    return {
      percentage: Math.round((uploadedCount / totalCount) * 100),
      isComplete: uploadedCount === totalCount,
      remaining: totalCount - uploadedCount,
    };
  }, [uploads]);

  const handleFileUpload = (docId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,image/*";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const url = URL.createObjectURL(file);
        setUploads((prev) => ({ ...prev, [docId]: { name: file.name, url } }));
        toast.success(`${file.name} ajouté.`);
      }
    };
    input.click();
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    // Simulation d'envoi vers ton API/Base de données
    await new Promise((resolve) => setTimeout(resolve, 2000));
    toast.success("Dossier finalisé !", {
      description: "Vos documents ont été transmis aux universités.",
    });
    setIsSubmitting(false);
  };

  // Fonction pour appeler l'API Gemini que nous avons créée
  const handleAnalyze = async (imageUrl: string) => {
    setAnalyzing(true);
    try {
      const res = await fetch("/api/analyze-doc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, type: "bac_transcript" }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setAiResult(data);
      toast.success("Analyse terminée ! Veuillez vérifier les notes.");
    } catch (err) {
      toast.error("L'IA n'a pas pu lire ce document. Vérifiez la netteté.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 space-y-8">
      {/* --- HEADER & PROGRESSION --- */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-dark tracking-tight">
              Dossier Académique
            </h1>
            <p className="text-gray-500 font-medium">
              Complétez tous les documents pour pouvoir postuler.
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-slate-400">
                Progression
              </p>
              <p className="text-2xl font-black text-secondary">
                {stats.percentage}%
              </p>
            </div>
            <div
              className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-secondary flex items-center justify-center rotate-45"
              style={{ transform: `rotate(${stats.percentage * 3.6}deg)` }}
            />
          </div>
        </div>

        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-secondary to-primary transition-all duration-700 ease-in-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
      </div>

      {/* SECTION RÉSULTAT IA (S'affiche après analyse) */}
      {aiResult && (
        <div className="bg-linear-to-r from-secondary/10 to-primary/10 border border-secondary/20 p-6 rounded-[2rem] animate-in zoom-in-95 duration-500">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-secondary animate-pulse" />
            <h3 className="font-black text-dark">Données détectées par Tawasol AI</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Moyenne Bac</p>
              <p className="text-2xl font-black text-secondary">{aiResult.moyenne}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Section / Série</p>
              <p className="text-lg font-black text-dark">{aiResult.serie}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
              <p className="text-[10px] font-black uppercase text-slate-400">Mention</p>
              <p className="text-lg font-black text-dark">{aiResult.mention}</p>
            </div>
          </div>
          
          <div className="mt-6 flex gap-3">
             <Button onClick={() => setAiResult(null)} className="bg-secondary text-white font-bold rounded-xl px-6">
                C'est correct <Check size={16} className="ml-2" />
             </Button>
             <Button variant="ghost" onClick={() => setAiResult(null)} className="text-slate-400 hover:text-red-500 font-bold">
                Modifier manuellement
             </Button>
          </div>
        </div>
      )}

      {/* LISTE DES DOCUMENTS (Modifiée pour le bouton IA) */}
      <div className="grid gap-4">
        {/* ... Ta boucle .map sur les documents ... */}
        {/* Exemple spécifique pour le relevé de notes Bac */}
        {/* Si doc.id === 'bac_transcript' ET que le fichier est présent : */}
        {uploads['bac_transcript'] && !aiResult && (
          <Button 
            disabled={analyzing}
            onClick={() => handleAnalyze(uploads['bac_transcript'].url)}
            className="w-full h-12 rounded-2xl bg-dark text-white font-bold border-2 border-secondary/30 hover:bg-secondary/20 hover:text-dark transition-all"
          >
            {analyzing ? (
              <><Loader2 className="mr-2 animate-spin" /> Analyse des notes en arabe...</>
            ) : (
              <><Sparkles className="mr-2" size={18} /> Extraire mes notes automatiquement (IA)</>
            )}
          </Button>
        )}
    </div>

      {/* --- LISTE DES DOCUMENTS --- */}
      <div className="grid gap-4">
        {REQUIRED_DOCS.map((doc) => {
          const docData = uploads[doc.id];
          const isUploaded = !!docData;

          return (
            <div
              key={doc.id}
              className={`group bg-white rounded-3xl border-2 p-5 transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${isUploaded ? "border-green-100 bg-green-50/5" : "border-gray-100"}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`p-3 rounded-xl ${isUploaded ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400"}`}
                >
                  {isUploaded ? (
                    <FileCheck size={24} />
                  ) : (
                    <FileText size={24} />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-dark">{doc.name}</h3>
                  <p className="text-xs text-gray-400">
                    {isUploaded ? docData.name : doc.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isUploaded ? (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setPreviewUrl(docData.url)}
                      className="text-slate-400 hover:text-secondary hover:bg-secondary/10"
                    >
                      <Eye size={20} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setUploads((prev) => {
                          const n = { ...prev };
                          delete n[doc.id];
                          return n;
                        })
                      }
                      className="text-slate-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => handleFileUpload(doc.id)}
                    size="sm"
                    className="bg-white border border-slate-200 text-dark hover:bg-slate-50 font-bold rounded-xl shadow-xs"
                  >
                    <Upload size={16} className="mr-2" /> Choisir
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- BOUTON FINAL --- */}
      <div className="flex flex-col items-center pt-6 space-y-4">
        {!stats.isComplete && (
          <div className="flex items-center gap-2 text-primary bg-primary/5 px-4 py-2 rounded-full border border-primary/10">
            <AlertCircle size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">
              Veuillez ajouter les {stats.remaining} documents manquants
            </span>
          </div>
        )}

        <Button
          disabled={!stats.isComplete || isSubmitting}
          onClick={handleFinalSubmit}
          className={`h-16 px-12 rounded-2xl font-black text-xl transition-all ${
            stats.isComplete
              ? "bg-secondary hover:bg-dark text-white shadow-2xl shadow-secondary/30 scale-105"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Envoi en cours..." : "Finaliser mon dossier"}
          <Send size={20} className="ml-3" />
        </Button>
      </div>

      {/* --- PREVIEW MODAL (IDEM PRÉCÉDENT) --- */}
      {previewUrl && (
        <div className="fixed inset-0 z-100 bg-dark/95 backdrop-blur-sm flex items-center justify-center p-6">
          <Button
            onClick={() => setPreviewUrl(null)}
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 text-white rounded-full p-4"
          >
            <X size={32} />
          </Button>
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-3xl overflow-hidden shadow-2xl">
            <iframe src={previewUrl} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
