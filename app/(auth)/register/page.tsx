"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dark">Créer votre compte</h1>
        <p className="text-gray-500 mt-2">Commencez votre parcours universitaire aujourd'hui</p>
      </div>

      <form className="space-y-4 mt-8">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">Prénom</Label>
            <Input id="first-name" placeholder="Ali" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Nom</Label>
            <Input id="last-name" placeholder="Ben Salah" required />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="ali.bensalah@gmail.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Créer un mot de passe</Label>
          <Input id="password" type="password" required />
        </div>
        
        <div className="flex items-start gap-2 py-2">
          <input type="checkbox" className="mt-1 accent-secondary" id="terms" required />
          <Label htmlFor="terms" className="text-xs text-gray-500 leading-tight">
            J'accepte les conditions d'utilisation et la politique de confidentialité de Tawasol.tn
          </Label>
        </div>

        <Button className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg">
          Créer mon compte
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  );
}