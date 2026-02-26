"use client";
import Navbar from "@/components/layout/Navbar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  if (isPending) return null; // Ou un spinner de chargement

  // Protection : Si pas student, redirection
  if (!session || (session.user as any).role !== "student") {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-24 container mx-auto px-6">
        {children}
      </main>
    </div>
  );
}