const MINIMUM_SECRET_LENGTH = 32;

export function getMongoDbUri(): string {
  const value =
    process.env.MONGODB_URI?.trim() || process.env.MONGO_URI?.trim();

  if (!value) {
    throw new Error(
      "Missing required environment variable: MONGODB_URI (or MONGO_URI)",
    );
  }

  return value;
}

export function getSessionSecret(): string {
  const secret = requireEnvironmentVariable("SESSION_SECRET");

  if (secret.length < MINIMUM_SECRET_LENGTH) {
    throw new Error(
      `SESSION_SECRET must contain at least ${MINIMUM_SECRET_LENGTH} characters.`,
    );
  }

  return secret;
}

function requireEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
