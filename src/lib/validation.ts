import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address" })
    .max(255, { message: "Email must be less than 255 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be less than 128 characters" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export const inviteEmailsSchema = z
  .string()
  .trim()
  .nonempty({ message: "Please enter at least one email address" })
  .transform((str) =>
    str
      .split(",")
      .map((e) => e.trim())
      .filter((e) => e)
  )
  .refine(
    (emails) => emails.length >= 3,
    { message: "Please invite at least 3 friends" }
  )
  .refine(
    (emails) => emails.every((email) => z.string().email().safeParse(email).success),
    { message: "All email addresses must be valid" }
  );

export type AuthInput = z.infer<typeof authSchema>;
export type InviteEmailsInput = string; // We'll validate the transform
