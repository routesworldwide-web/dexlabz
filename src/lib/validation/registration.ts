import { z } from "zod";

const namePattern = /^[\p{L}\p{M}][\p{L}\p{M}\s.'’-]*$/u;
const mobilePattern = /^\+?[1-9]\d{6,14}$/;

export const registrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Enter your full name.")
    .max(100, "Name must be 100 characters or fewer.")
    .regex(namePattern, "Enter a valid name."),
  mobile: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s()-]/g, ""))
    .pipe(
      z
        .string()
        .regex(
          mobilePattern,
          "Enter a valid mobile number, including country code when needed.",
        ),
    ),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Enter a valid email address.").max(254)),
  authenticationCode: z
    .string()
    .trim()
    .min(4, "Authentication code must contain at least 4 characters.")
    .max(128, "Authentication code must be 128 characters or fewer."),
});

export type RegistrationInput = z.input<typeof registrationSchema>;
export type RegistrationData = z.output<typeof registrationSchema>;
