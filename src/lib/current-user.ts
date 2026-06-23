import { cookies } from "next/headers";
import { Types } from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import {
  SESSION_COOKIE_NAME,
  verifySessionToken,
} from "@/lib/session-token";
import { UserModel } from "@/models/User";

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  mobile: string;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = await verifySessionToken(token);

  if (!session || !Types.ObjectId.isValid(session.userId)) {
    return null;
  }

  await connectToDatabase();

  const user = await UserModel.findById(session.userId)
    .select({ name: 1, email: 1, mobile: 1 })
    .lean();

  if (!user) {
    return null;
  }

  return {
    id: user._id.toHexString(),
    name: user.name,
    email: user.email,
    mobile: user.mobile,
  };
}
