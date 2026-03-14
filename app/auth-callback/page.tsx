"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleRedirection = async () => {
      // 1. Récupérer la session fraîche
      const { data: session, error } = await authClient.getSession();

      if (error || !session) {
        router.push("/login");
        return;
      }

      // 2. Extraire le rôle
      const role = (session.user as any)?.role;

      // 3. Logique de tri
      switch (role) {
        case "admin":
          router.push("/dashboard");
          break;
        case "professor":
          router.push("/professor/home");
          break;
        case "student":
          router.push("/student/home");
          break;
        default:
          router.push("/student/home");
          break;
      }
    };

    handleRedirection();
  }, [router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center space-y-4 bg-slate-50">
      <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      <div className="text-center">
        <h2 className="text-xl font-bold text-dark">Vérification de votre compte...</h2>
        <p className="text-gray-500">Préparation de votre espace personnalisé</p>
      </div>
    </div>
  );
}