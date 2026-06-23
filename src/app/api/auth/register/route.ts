import { NextResponse } from "next/server";

import {
  registerUser,
  RegistrationError,
} from "@/lib/registration";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  sessionCookieOptions,
} from "@/lib/session-token";
import { registrationSchema } from "@/lib/validation/registration";

export const runtime = "nodejs";

type ErrorResponse = {
  success: false;
  message: string;
  code:
    | "INVALID_INPUT"
    | "EMAIL_ALREADY_USED"
    | "CODE_UNAVAILABLE"
    | "SERVER_ERROR";
  fieldErrors?: Record<string, string>;
};

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(
      "INVALID_INPUT",
      "Submit a valid registration request.",
      400,
    );
  }

  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};

    for (const issue of parsed.error.issues) {
      const field = issue.path[0];

      if (typeof field === "string" && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return errorResponse(
      "INVALID_INPUT",
      "Check the highlighted fields and try again.",
      400,
      fieldErrors,
    );
  }

  try {
    const result = await registerUser(parsed.data);
    const sessionToken = await createSessionToken(result.userId);
    const response = NextResponse.json(
      {
        success: true,
        message: "Your access has been verified.",
      },
      { status: 201 },
    );

    response.cookies.set(
      SESSION_COOKIE_NAME,
      sessionToken,
      sessionCookieOptions,
    );

    return response;
  } catch (error: unknown) {
    if (error instanceof RegistrationError) {
      if (error.code === "EMAIL_ALREADY_USED") {
        return errorResponse(
          error.code,
          "This email address has already been registered.",
          409,
        );
      }

      return errorResponse(
        error.code,
        "This authentication code is invalid or no longer available.",
        400,
      );
    }

    console.error("Registration failed.", {
      errorName: error instanceof Error ? error.name : "UnknownError",
    });

    return errorResponse(
      "SERVER_ERROR",
      "We could not complete registration. Please try again.",
      500,
    );
  }
}

function errorResponse(
  code: ErrorResponse["code"],
  message: string,
  status: number,
  fieldErrors?: Record<string, string>,
) {
  return NextResponse.json(
    {
      success: false,
      code,
      message,
      ...(fieldErrors ? { fieldErrors } : {}),
    } satisfies ErrorResponse,
    { status },
  );
}
