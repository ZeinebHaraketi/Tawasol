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


export const updateUserSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom d'affichage doit contenir au moins 2 caractères")
    .max(50),
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50)
    .optional()
    .or(z.literal("")), // Permet de laisser vide si besoin
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50)
    .optional()
    .or(z.literal("")),
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;