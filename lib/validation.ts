import z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom est trop court"),
  lastName: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(8, "Le mot de passe doit faire au moins 8 caractères"),
});