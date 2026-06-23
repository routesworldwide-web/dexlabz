import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { normalizeAuthCode } from "@/lib/normalization";
import type { RegistrationData } from "@/lib/validation/registration";
import { AuthenticationCodeModel } from "@/models/AuthenticationCode";
import { UserModel } from "@/models/User";

export class RegistrationError extends Error {
  constructor(
    public readonly code: "EMAIL_ALREADY_USED" | "CODE_UNAVAILABLE",
  ) {
    super(code);
    this.name = "RegistrationError";
  }
}

export async function registerUser(
  registration: RegistrationData,
): Promise<{ userId: string }> {
  const database = await connectToDatabase();
  const session = await database.connection.startSession();
  const userId = new Types.ObjectId();
  const now = new Date();

  try {
    await session.withTransaction(
      async () => {
        const claimedCode =
          await AuthenticationCodeModel.findOneAndUpdate(
            {
              code: normalizeAuthCode(registration.authenticationCode),
              usedAt: { $exists: false },
              $and: [
                {
                  $or: [
                    { assignedEmail: { $exists: false } },
                    { assignedEmail: null },
                    { assignedEmail: registration.email },
                  ],
                },
                {
                  $or: [
                    { expiresAt: { $exists: false } },
                    { expiresAt: null },
                    { expiresAt: { $gt: now } },
                  ],
                },
              ],
            },
            {
              $set: {
                usedAt: now,
                usedBy: userId,
              },
            },
            {
              new: true,
              session,
            },
          ).lean();

        if (!claimedCode) {
          throw new RegistrationError("CODE_UNAVAILABLE");
        }

        await UserModel.create(
          [
            {
              _id: userId,
              name: registration.name,
              email: registration.email,
              mobile: registration.mobile,
            },
          ],
          { session },
        );
      },
      {
        readConcern: { level: "snapshot" },
        writeConcern: { w: "majority" },
      },
    );

    return { userId: userId.toHexString() };
  } catch (error: unknown) {
    if (error instanceof RegistrationError) {
      throw error;
    }

    if (isDuplicateKeyError(error)) {
      throw new RegistrationError("EMAIL_ALREADY_USED");
    }

    throw error;
  } finally {
    await session.endSession();
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  );
}
