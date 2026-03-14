"use client";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { loginSchema } from "@/lib/validation";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const router = useRouter();

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   setError("");

  //   setFieldErrors({});

  //   // --- 2. CONTRÔLE DE SAISIE AVEC ZOD ---
  //   const validation = loginSchema.safeParse({ email, password });

  //   if (!validation.success) {
  //     const errors = validation.error.flatten().fieldErrors;
  //     setFieldErrors({
  //       email: errors.email?.[0],
  //       password: errors.password?.[0],
  //     });
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const { error } = await authClient.signIn.email({
  //       email,
  //       password,
  //       // callbackURL: "/dashboard",
  //     });

  //     if (error) {
  //       setError("Email ou mot de passe incorrect.");
  //       toast.error("Connexion échouée", {
  //         description: "Email ou mot de passe incorrect. Réessayez.",
  //       });
  //       return;
  //     }

  //     // RÉCUPÉRATION DU RÔLE (Une fois connecté, on check la session)
  // const session = await authClient.getSession();
  // const role = (session?.data?.user as any)?.role;

  //     toast.success("Succès !", {
  //       description: "Ravi de vous revoir sur Tawasol.",
  //     });
  //     // router.push("/dashboard");

  //     // REDIRECTION DYNAMIQUE
  // switch (role) {
  //   case "admin":
  //     router.push("/dashboard");
  //     break;
  //   case "professor":
  //     router.push("/professor/home");
  //     break;
  //   case "student":
  //   default:
  //     router.push("/student/home"); // Page d'accueil pour les étudiants
  //     break;
  // }
  //   } catch (error) {
  //     setError("Une erreur réseau est survenue.");
  //     toast.error("Connexion échouée", {
  //       description: "Une erreur réseau est survenue. Réessayez.",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      const errors = validation.error.flatten().fieldErrors;
      setFieldErrors({
        email: errors.email?.[0],
        password: errors.password?.[0],
      });
      setLoading(false);
      return;
    }

    try {
      // 1. On récupère le résultat directement du signIn
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/auth-callback",
      });

      if (error) {
        setError("Email ou mot de passe incorrect.");
        toast.error("Connexion échouée");
        setLoading(false);
        return;
      }

      // 2. On extrait le rôle depuis 'data.user' renvoyé par le signIn
      // Pas besoin de getSession() ici !
      const role = (data?.user as any)?.role;

      toast.success("Succès !", {
        description: "Ravi de vous revoir sur Tawasol.",
      });

      // 3. Redirection avec un petit délai (optionnel mais recommandé pour laisser les cookies s'installer)
      setTimeout(() => {
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
      }, 100);
    } catch (error) {
      setError("Une erreur réseau est survenue.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await authClient.signOut();
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/auth-callback", // On envoie l'utilisateur vers notre trieur
    });
  };

  return (
    <>
      <div className="text-center">
        <Image
          src="/logo.png"
          alt="Logo"
          width={60}
          height={60}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-dark">Bon retour !</h1>
        <p className="text-gray-500 mt-2">
          Connectez-vous à votre espace étudiant
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 rounded-xl flex items-center gap-2 border-gray-200 hover:bg-gray-50"
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
        Continuer avec Google
      </Button>

      <form className="space-y-4 mt-8" onSubmit={handleLogin}>
        {error && (
          <div className="p-4 bg-primary/10 text-primary text-sm font-bold rounded-2xl border border-primary/20">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email professionnel ou personnel</Label>
          <div className="relative group">
            <Mail
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors"
              size={18}
            />
            <Input
              id="email"
              type="email"
              placeholder="nom@exemple.tn"
              required
              className="h-12 pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-[11px] text-primary font-bold ml-1">
              {fieldErrors.email}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="password">Mot de passe</Label>
            <Link href="#" className="text-sm text-secondary hover:underline">
              Oublié ?
            </Link>
          </div>
          <div className="relative group">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors"
              size={18}
            />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              className="h-12 pl-12"
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
            <p className="text-[11px] text-primary font-bold ml-1">
              {fieldErrors.password}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-primary hover:bg-deep text-white font-bold text-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>
              Se connecter
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </>
          )}{" "}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Pas encore de compte ?{" "}
        <Link
          href="/register"
          className="text-secondary font-bold hover:underline"
        >
          Créer un dossier
        </Link>
      </p>
    </>
  );
}
