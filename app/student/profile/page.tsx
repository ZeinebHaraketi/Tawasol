"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  User,
  Mail,
  Camera,
  Save,
  Loader2,
  ShieldCheck,
  GraduationCap,
  FileText,
  CheckCircle2,
  Sparkles,
  Lock,
  Award,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { updateUserSchema } from "@/lib/validation";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const [updating, setUpdating] = useState(false);

  const initial = session?.user?.name?.charAt(0).toUpperCase() || "U";
  const role = (session?.user as any)?.role || "Étudiant";

  const handleUpdateProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    const formData = new FormData(e.currentTarget);
    const values = {
      name: formData.get("name"),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
    };

    const validatedFields = updateUserSchema.safeParse(values);
    if (!validatedFields.success) {
      toast.error("Veuillez vérifier vos informations");
      setUpdating(false);
      return;
    }

    const { error } = await authClient.updateUser({
      name: validatedFields.data.name,
      ...({
        firstName: validatedFields.data.firstName,
        lastName: validatedFields.data.lastName,
      } as any),
    });

    if (error) toast.error(error.message);
    else toast.success("Profil synchronisé !");
    setUpdating(false);
  };

  if (isPending)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin" />
      </div>
    );

  const compressImage = (file: File, maxWidth = 400): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const scaleFactor = maxWidth / img.width;

          // On garde le ratio, mais on limite la largeur à 400px (suffisant pour un profil)
          canvas.width = maxWidth;
          canvas.height = img.height * scaleFactor;

          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // On compresse en JPEG avec une qualité de 0.7 (70%)
          const base64 = canvas.toDataURL("image/jpeg", 0.7);
          resolve(base64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleProfileImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    toast.loading("Optimisation de l'image...", { id: "profile-update" });

    // 1. Compression de l'image
    const compressedBase64 = await compressImage(file, 400);
    setPreviewImage(compressedBase64);

    // 2. Envoi à la base de données via authClient
    const { error } = await authClient.updateUser({
      image: compressedBase64,
    });

    if (error) {
      toast.error("Erreur : " + error.message, { id: "profile-update" });
    } else {
      toast.success("Photo de profil mise à jour !", { id: "profile-update" });
    }
  } catch (err) {
    toast.error("Erreur lors de la compression", { id: "profile-update" });
    console.error(err);
  }
};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* --- SECTION HEADER : BANNERE & AVATAR --- */}
      <div className="relative">
        <div className="h-60 md:h-72 rounded-[3rem] bg-gradient-to-tr from-dark via-[#1a2238] to-secondary overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute top-6 right-6">
            <Button
              variant="ghost"
              className="bg-white/10 backdrop-blur-xl text-white border border-white/20 rounded-2xl hover:bg-white/20 transition-all"
            >
              <Camera size={18} className="mr-2" />{" "}
              <span className="hidden sm:inline">Changer la bannière</span>
            </Button>
          </div>
        </div>

        {/* Info Profil avec décalage corrigé */}
        <div className="absolute -bottom-12 left-8 md:left-14 flex flex-col md:flex-row items-end gap-6 w-[calc(100%-4rem)]">
          <div className="relative shrink-0">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-[3rem] bg-white p-2 shadow-2xl relative z-10">
              <div className="w-full h-full rounded-[2.8rem] overflow-hidden bg-slate-50 flex items-center justify-center text-6xl font-black text-secondary border border-gray-100">
                {previewImage || session?.user?.image ? (
                  <img
                    src={previewImage || session?.user?.image || ""}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>{initial}</span>
                )}
              </div>
            </div>
            {/* Bouton Camera qui déclenche l'input standard */}
            <label
              htmlFor="profile-upload"
              className="absolute bottom-1 right-1 md:bottom-3 md:right-3 p-3 bg-secondary text-white rounded-2xl shadow-xl hover:scale-110 transition-all border-4 border-white cursor-pointer z-20"
            >
              <Camera size={20} />
            </label>

            <input
              id="profile-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleProfileImageChange}
            />
          </div>

          <div className="pb-8 space-y-2 flex-1">
            {" "}
            <div className="flex items-center gap-3">
              {/* IMPORTANT: Si le nom touche la bannière sombre, on utilise text-white. 
         S'il est sur le blanc, on utilise text-dark.
      */}
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white drop-shadow-md">
                {session?.user?.name}
              </h1>
              <div className="bg-green-500 text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                <ShieldCheck size={18} fill="currentColor" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold border border-white/30 shadow-sm">
                <GraduationCap size={14} /> {role}
              </span>
              <span className="flex items-center gap-2 px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold border border-white/30 shadow-sm">
                <MapPin size={14} /> Tunisie
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-16">
        {/* --- SIDEBAR GAUCHE --- */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white/70 backdrop-blur-md border border-white">
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase text-slate-400 tracking-widest">
                Résumé du compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 pt-2">
              <div className="space-y-4">
                <div className="flex justify-between font-black text-dark tracking-tight">
                  <span>Qualité du profil</span>
                  <span className="text-secondary">85%</span>
                </div>
                <div className="h-3.5 w-full bg-slate-100 rounded-full p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-secondary to-[#f97316] rounded-full shadow-md"
                    style={{ width: "85%" }}
                  />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                  "Plus votre profil est complet, plus les universités vous
                  remarqueront."
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-4">
                <h3 className="font-black text-dark text-xs uppercase tracking-widest">
                  Succès
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div
                    className="p-3 bg-amber-50 rounded-2xl border border-amber-100 group hover:bg-amber-100 transition-colors"
                    title="Pionnier"
                  >
                    <Award
                      className="text-amber-500 group-hover:scale-110 transition-transform"
                      size={24}
                    />
                  </div>
                  <div className="px-4 py-2 bg-blue-50 rounded-2xl border border-blue-100 text-blue-600 font-black text-[10px] uppercase justify-center flex items-center gap-1">
                    Anglais B2
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 bg-dark rounded-[2.5rem] text-white relative overflow-hidden group shadow-2xl shadow-dark/20">
            <Sparkles className="absolute top-4 right-4 text-secondary/40 animate-pulse" />
            <div className="relative z-10">
              <h4 className="text-xl font-black mb-3 italic">
                Tawasol Premium
              </h4>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed font-medium">
                Débloquez l'accès prioritaire aux bourses internationales.
              </p>
              <Button className="w-full bg-secondary hover:bg-white text-dark font-black rounded-2xl py-6 transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-secondary/10">
                Upgrade Maintenant
              </Button>
            </div>
          </div>
        </div>

        {/* --- CONTENU PRINCIPAL --- */}
        <div className="lg:col-span-8">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-slate-100/80 p-2 rounded-3xl h-auto gap-2 mb-10 border border-slate-200 shadow-inner">
              <TabsTrigger
                value="general"
                className="rounded-[1.2rem] px-8 py-3.5 data-[state=active]:bg-white data-[state=active]:shadow-xl font-black transition-all text-slate-500 data-[state=active]:text-dark"
              >
                <User size={18} className="mr-2" /> Général
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="rounded-[1.2rem] px-8 py-3.5 data-[state=active]:bg-white data-[state=active]:shadow-xl font-black transition-all text-slate-500 data-[state=active]:text-dark"
              >
                <Lock size={18} className="mr-2" /> Sécurité
              </TabsTrigger>
              <TabsTrigger
                value="docs"
                className="rounded-[1.2rem] px-8 py-3.5 data-[state=active]:bg-white data-[state=active]:shadow-xl font-black transition-all text-slate-500 data-[state=active]:text-dark"
              >
                <FileText size={18} className="mr-2" /> Documents
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="general"
              className="animate-in fade-in zoom-in-95 duration-500"
            >
              <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-3xl font-black text-dark">
                    Informations du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-4">
                  <form onSubmit={handleUpdateProfile} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          defaultValue={(session?.user as any)?.firstName || ""}
                          className="h-16 rounded-[1.5rem] bg-slate-50 border-slate-100 px-7 font-bold text-dark focus:bg-white focus:ring-4 focus:ring-secondary/5 transition-all outline-none"
                        />
                      </div>
                      <div className="space-y-3 group">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                          Nom de famille
                        </Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          defaultValue={(session?.user as any)?.lastName || ""}
                          className="h-16 rounded-[1.5rem] bg-slate-50 border-slate-100 px-7 font-bold text-dark focus:bg-white focus:ring-4 focus:ring-secondary/5 transition-all outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                        Nom d'affichage
                      </Label>
                      <div className="relative">
                        <User
                          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                          size={20}
                        />
                        <Input
                          id="name"
                          name="name"
                          defaultValue={session?.user?.name || ""}
                          className="pl-16 h-16 rounded-[1.5rem] bg-slate-50 border-slate-100 font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">
                        Email institutionnel
                      </Label>
                      <div className="relative">
                        <Mail
                          className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300"
                          size={20}
                        />
                        <Input
                          value={session?.user?.email || ""}
                          disabled
                          className="pl-16 h-16 rounded-[1.5rem] bg-slate-100/50 border-none font-medium italic text-slate-400 cursor-not-allowed"
                        />
                      </div>
                    </div>

                    <div className="pt-6">
                      <Button
                        type="submit"
                        disabled={updating}
                        className="w-full md:w-auto bg-dark hover:bg-secondary text-white hover:text-dark h-16 px-14 rounded-[1.8rem] font-black text-lg transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group"
                      >
                        {updating ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Save
                            className="group-hover:rotate-6 transition-transform"
                            size={22}
                          />
                        )}
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sécurité et Documents restent similaires mais avec le style arrondi */}
            <TabsContent value="security">
              <Card className="border-none shadow-xl rounded-[3rem] p-12 text-center bg-white">
                <div className="w-24 h-24 bg-green-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-black mb-3 text-dark">
                  Votre sécurité est au top
                </h3>
                <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">
                  Nous protégeons vos données académiques avec un chiffrement de
                  niveau bancaire.
                </p>
                <Button
                  variant="outline"
                  className="h-14 px-10 rounded-2xl font-black border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Changer de mot de passe
                </Button>
              </Card>
            </TabsContent>

            <TabsContent value="docs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-10 border-4 border-dashed border-slate-100 rounded-[3rem] bg-slate-50/50 flex flex-col items-center justify-center space-y-4 hover:border-secondary/30 hover:bg-white transition-all cursor-pointer group">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <FileText
                      className="text-slate-300 group-hover:text-secondary"
                      size={32}
                    />
                  </div>
                  <p className="font-black text-slate-400 group-hover:text-dark transition-colors">
                    Uploader mon CV (PDF)
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
