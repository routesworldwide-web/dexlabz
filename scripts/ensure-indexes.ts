import { loadEnvConfig } from "@next/env";

import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../src/lib/mongodb";
import { AuthenticationCodeModel } from "../src/models/AuthenticationCode";
import { UserModel } from "../src/models/User";

loadEnvConfig(process.cwd());

async function main(): Promise<void> {
  await connectToDatabase();

  await Promise.all([
    UserModel.createIndexes(),
    AuthenticationCodeModel.createIndexes(),
  ]);

  console.log("MongoDB indexes are ready.");
  console.log("Users: users_email_unique");
  console.log(
    "Authentication codes: authentication_codes_code_unique, authentication_codes_availability",
  );
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Failed to create indexes.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
