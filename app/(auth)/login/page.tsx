"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <>
      <div className="text-center">
        <Image src="/logo.png" alt="Logo" width={60} height={60} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-dark">Bon retour !</h1>
        <p className="text-gray-500 mt-2">Connectez-vous à votre espace étudiant</p>
      </div>

      <form className="space-y-4 mt-8">
        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel ou personnel</Label>
          <Input id="email" type="email" placeholder="nom@exemple.tn" required className="h-12" />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="#" className="text-sm text-secondary hover:underline">Oublié ?</Link>
          </div>
          <Input id="password" type="password" required className="h-12" />
        </div>
        <Button className="w-full h-12 bg-primary hover:bg-deep text-white font-bold text-lg">
          Se connecter
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-secondary font-bold hover:underline">
          Créer un dossier
        </Link>
      </p>
    </>
  );
}