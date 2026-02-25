"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { ArrowRight, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { registerSchema } from "@/lib/validation";
import { toast } from "sonner";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors({});
    setError("");

    const validation = registerSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });

    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};
      Object.keys(errors).forEach((key) => {
        formattedErrors[key] = errors[key as keyof typeof errors]?.[0] || "";
      });
      setFieldErrors(formattedErrors);
      setLoading(false);
      return toast.error("Formulaire invalide", {
        description: "Veuillez corriger les erreurs indiquées.",
      });
    }

    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      // Better Auth mappera automatiquement firstName et lastName si tu as configuré additionalFields
      // @ts-ignore
      firstName,
      lastName,
      callbackURL: "/dashboard",
    });

    if (error) {
      toast.error("Erreur d'inscription", {
        description: error.message || "Une erreur est survenue.",
      });
      setLoading(false);
    } else {
      toast.success("Compte créé !", {
        description: "Bienvenue sur Tawasol. Redirection en cours...",
      });
      router.push("/dashboard");
    }
  };


  const handleGoogleLogin = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/dashboard",
  });
};

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-dark">Créer votre compte</h1>
        <p className="text-gray-500 mt-2">
          Commencez votre parcours universitaire aujourd'hui
        </p>
      </div>

      <form className="space-y-4 mt-8" onSubmit={handleRegister}>
        {error && (
          <div className="p-4 bg-primary/10 text-primary text-sm font-bold rounded-2xl border border-primary/20 animate-shake">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">Prénom</Label>
            <Input
              id="first-name"
              placeholder="Ali"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          {fieldErrors.firstName && (
            <p className="text-[10px] text-primary font-bold ml-1">
              {fieldErrors.firstName}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="last-name">Nom</Label>
            <Input
              id="last-name"
              placeholder="Ben Salah"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          {fieldErrors.lastName && (
            <p className="text-[10px] text-primary font-bold ml-1">
              {fieldErrors.lastName}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="ali.bensalah@gmail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {fieldErrors.email && (
          <p className="text-[10px] text-primary font-bold ml-1">
            {fieldErrors.email}
          </p>
        )}
        <div className="space-y-2">
          <Label htmlFor="password">Créer un mot de passe</Label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors" size={17} />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              className={`pl-11 pr-12 h-12 rounded-xl ${fieldErrors.password ? "border-primary" : ""}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-dark transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        {fieldErrors.password && (
          <p className="text-[10px] text-primary font-bold ml-1">
            {fieldErrors.password}
          </p>
        )}
        </div>

        <div className="flex items-start gap-2 py-2">
          <input
            type="checkbox"
            className="mt-1 accent-secondary"
            id="terms"
            required
          />
          <Label
            htmlFor="terms"
            className="text-xs text-gray-500 leading-tight"
          >
            J'accepte les conditions d'utilisation et la politique de
            confidentialité de Tawasol.tn
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-secondary hover:bg-secondary/90 text-white font-bold text-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span className="flex items-center gap-2">
              Créer mon compte
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </span>
          )}{" "}
        </Button>
      </form>

      {/* Séparateur visuel */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500 font-medium">Ou continuer avec</span>
          </div>
        </div>

        {/* Bouton Google */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 font-semibold text-dark"
          onClick={handleGoogleLogin}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          S'inscrire avec Google
        </Button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Vous avez déjà un compte ?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Se connecter
        </Link>
      </p>
    </>
  );
}
