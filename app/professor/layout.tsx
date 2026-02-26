"use client";
import { useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function ProfessorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const isAuthorized = session && (session.user as any).role === "professor";

  useEffect(() => {
    if (!isPending && !isAuthorized) {
      router.push("/login");
    }
  }, [isPending, isAuthorized, router]);

  if (isPending) return null;

  // Protection : Si pas professor, redirection
  // if (!session || (session.user as any).role !== "professor") {
  //   router.push("/login");
  //   return null;
  // }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-24 container mx-auto px-6">
        <div className="bg-primary/10 p-4 rounded-xl mb-6 border border-primary/20">
          <p className="text-primary font-bold text-sm text-center">
            Espace Enseignant Certifié
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
