"use client";

import { useState, type FormEvent } from "react";

import {
  registrationSchema,
  type RegistrationInput,
} from "@/lib/validation/registration";

type FieldName = keyof RegistrationInput;
type FieldErrors = Partial<Record<FieldName, string>>;
type FormStatus =
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | null;

type RegistrationResponse =
  | {
      success: true;
      message: string;
    }
  | {
      success: false;
      message: string;
      code: string;
      fieldErrors?: Record<string, string>;
    };

const initialValues: RegistrationInput = {
  name: "",
  mobile: "",
  email: "",
  authenticationCode: "",
};

const fields: Array<{
  name: FieldName;
  label: string;
  type: "text" | "tel" | "email";
  placeholder: string;
  autoComplete: string;
  inputMode?: "email" | "tel" | "text";
}> = [
  {
    name: "name",
    label: "Full name",
    type: "text",
    placeholder: "Your full name",
    autoComplete: "name",
  },
  {
    name: "mobile",
    label: "Mobile number",
    type: "tel",
    placeholder: "+91 98765 43210",
    autoComplete: "tel",
    inputMode: "tel",
  },
  {
    name: "email",
    label: "Email address",
    type: "email",
    placeholder: "you@example.com",
    autoComplete: "email",
    inputMode: "email",
  },
  {
    name: "authenticationCode",
    label: "Authentication code",
    type: "text",
    placeholder: "Enter your one-time code",
    autoComplete: "one-time-code",
    inputMode: "text",
  },
];

export function RegistrationForm() {
  const [values, setValues] = useState<RegistrationInput>(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<FormStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  function updateField(name: FieldName, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setStatus(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(null);

    const result = registrationSchema.safeParse(values);

    if (!result.success) {
      const nextErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as FieldName | undefined;

        if (field && !nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      }

      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(result.data),
      });
      const payload = (await response.json()) as RegistrationResponse;

      if (!response.ok || !payload.success) {
        if (!payload.success && payload.fieldErrors) {
          const serverErrors: FieldErrors = {};

          for (const [field, message] of Object.entries(payload.fieldErrors)) {
            if (isFieldName(field)) {
              serverErrors[field] = message;
            }
          }

          setErrors(serverErrors);
        }

        setStatus({
          type: "error",
          message: payload.message || "Registration could not be completed.",
        });
        return;
      }

      setIsComplete(true);
      setValues(initialValues);
      setStatus({
        type: "success",
        message: payload.message,
      });
      window.location.assign("/welcome");
    } catch {
      setStatus({
        type: "error",
        message: "Unable to reach the server. Check your connection and retry.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
      <div className="grid gap-2 sm:grid-cols-2">
        {fields.map((field) => {
          const error = errors[field.name];
          const inputId = `registration-${field.name}`;
          const errorId = `${inputId}-error`;
          const isCode = field.name === "authenticationCode";
          const isFullWidth = field.name === "email" || isCode;

          return (
            <div
              className={isFullWidth ? "sm:col-span-2" : undefined}
              key={field.name}
            >
              <label
                className="sr-only"
                htmlFor={inputId}
              >
                {field.label}
              </label>
              <div className="relative">
                <input
                  aria-describedby={error ? errorId : undefined}
                  aria-invalid={Boolean(error)}
                  autoCapitalize={isCode ? "characters" : "none"}
                  autoComplete={field.autoComplete}
                  className="h-12 w-full  border border-slate-200 bg-white px-4 text-[15px] text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:focus:border-rose-500 aria-[invalid=true]:focus:ring-rose-500/10"
                  id={inputId}
                  inputMode={field.inputMode}
                  disabled={isSubmitting || isComplete}
                  maxLength={field.name === "name" ? 100 : 128}
                  name={field.name}
                  onChange={(event) =>
                    updateField(field.name, event.target.value)
                  }
                  placeholder={field.placeholder}
                  spellCheck={false}
                  type={field.type}
                  value={values[field.name]}
                />
                {isCode ? (
                  <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <KeyIcon />
                  </span>
                ) : null}
              </div>
              <p
                className={`mt-1.5 min-h-5 text-xs ${
                  error ? "text-rose-600" : "text-transparent"
                }`}
                id={errorId}
                role={error ? "alert" : undefined}
              >
                {error ?? "No error"}
              </p>
            </div>
          );
        })}
      </div>

      <button
        className="group flex h-13 w-full items-center justify-center gap-2  bg-slate-950 px-5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-700/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:translate-y-0 disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-slate-400 disabled:shadow-none"
        disabled={isSubmitting || isComplete}
        type="submit"
      >
        {isSubmitting
          ? "Verifying securely..."
          : isComplete
            ? "Access verified"
            : "Verify and continue"}
        {isSubmitting ? <SpinnerIcon /> : isComplete ? <CheckIcon /> : <ArrowIcon />}
      </button>

      <div aria-live="polite" className="min-h-11">
        {status ? (
          <p
            className={`rounded-xl border px-4 py-3 text-center text-sm ${
              status.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
            role={status.type === "error" ? "alert" : "status"}
          >
            {status.message}
          </p>
        ) : (
          <p className="flex items-center justify-center gap-2 text-center text-xs leading-5 text-slate-500">
            <LockIcon />
            Your code and email can each be used only once.
          </p>
        )}
      </div>
    </form>
  );
}

function isFieldName(value: string): value is FieldName {
  return (
    value === "name" ||
    value === "mobile" ||
    value === "email" ||
    value === "authenticationCode"
  );
}

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 transition-transform group-hover:translate-x-0.5"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M5 12h14m-5-5 5 5-5 5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 text-slate-400"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M15.5 7.5a4 4 0 1 1-1.17 2.83L21 3.67M18 6l2 2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-3.5 shrink-0"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10m-10 0h11a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 animate-spin"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-30"
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="3"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="m5 12 4 4L19 6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
