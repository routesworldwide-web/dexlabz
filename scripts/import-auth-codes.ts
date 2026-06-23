import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

import { loadEnvConfig } from "@next/env";
import { z } from "zod";

import {
  connectToDatabase,
  disconnectFromDatabase,
} from "../src/lib/mongodb";
import {
  normalizeAuthCode,
  normalizeEmail,
} from "../src/lib/normalization";
import { AuthenticationCodeModel } from "../src/models/AuthenticationCode";

const MAX_CODES_PER_IMPORT = 100_000;

const codeObjectSchema = z.object({
  code: z.string().min(1).max(128),
  assignedEmail: z.email().optional(),
  batch: z.string().trim().min(1).max(100).optional(),
  expiresAt: z.iso.datetime({ offset: true }).optional(),
});

type ParsedCode = {
  code: string;
  assignedEmail?: string;
  batch?: string;
  expiresAt?: Date;
};

type PreparedCode = ParsedCode;

function printUsage(): void {
  console.log(
    [
      "Usage:",
      "  npm run codes:import -- <file.json|file.txt> [--dry-run]",
      "",
      "JSON accepts an array of strings or objects:",
      '  ["CODE-001", {"code":"CODE-002","assignedEmail":"user@example.com"}]',
      "",
      "Text accepts one code per line. Blank lines and lines beginning with # are ignored.",
    ].join("\n"),
  );
}

function parseJson(content: string): ParsedCode[] {
  const value: unknown = JSON.parse(content);

  if (!Array.isArray(value)) {
    throw new Error("The JSON file must contain an array.");
  }

  return value.map((entry, index) => {
    const parsed = codeObjectSchema.safeParse(
      typeof entry === "string" ? { code: entry } : entry,
    );

    if (!parsed.success) {
      throw new Error(
        `Invalid authentication-code entry at JSON position ${index + 1}.`,
      );
    }

    return {
      code: parsed.data.code,
      assignedEmail: parsed.data.assignedEmail
        ? normalizeEmail(parsed.data.assignedEmail)
        : undefined,
      batch: parsed.data.batch,
      expiresAt: parsed.data.expiresAt
        ? new Date(parsed.data.expiresAt)
        : undefined,
    };
  });
}

function parseText(content: string): ParsedCode[] {
  return content
    .split(/\r?\n/u)
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("#"))
    .map((code) => {
      const parsed = codeObjectSchema.shape.code.safeParse(code);

      if (!parsed.success) {
        throw new Error(
          "Every text-file code must contain between 1 and 128 characters.",
        );
      }

      return { code: parsed.data };
    });
}

async function readCodes(filePath: string): Promise<ParsedCode[]> {
  const content = await readFile(filePath, "utf8");
  const extension = extname(filePath).toLowerCase();

  if (extension === ".json") {
    return parseJson(content);
  }

  if (extension === ".txt") {
    return parseText(content);
  }

  throw new Error("Only .json and .txt authentication-code files are supported.");
}

function prepareCodes(codes: ParsedCode[]): {
  codes: PreparedCode[];
  duplicatesInFile: number;
} {
  const uniqueCodes = new Map<string, PreparedCode>();

  for (const entry of codes) {
    const code = normalizeAuthCode(entry.code);

    if (!uniqueCodes.has(code)) {
      uniqueCodes.set(code, {
        code,
        assignedEmail: entry.assignedEmail,
        batch: entry.batch,
        expiresAt: entry.expiresAt,
      });
    }
  }

  return {
    codes: [...uniqueCodes.values()],
    duplicatesInFile: codes.length - uniqueCodes.size,
  };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h") || args.length === 0) {
    printUsage();
    return;
  }

  const dryRun = args.includes("--dry-run");
  const fileArgument = args.find((argument) => !argument.startsWith("--"));

  if (!fileArgument) {
    throw new Error("Provide a .json or .txt file containing authentication codes.");
  }

  loadEnvConfig(process.cwd());

  const filePath = resolve(process.cwd(), fileArgument);
  const parsedCodes = await readCodes(filePath);

  if (parsedCodes.length === 0) {
    throw new Error("The selected file does not contain any authentication codes.");
  }

  if (parsedCodes.length > MAX_CODES_PER_IMPORT) {
    throw new Error(
      `A single import cannot exceed ${MAX_CODES_PER_IMPORT.toLocaleString()} codes.`,
    );
  }

  const prepared = prepareCodes(parsedCodes);

  await connectToDatabase();
  await AuthenticationCodeModel.createIndexes();

  const existingCodes = await AuthenticationCodeModel.countDocuments({
    code: { $in: prepared.codes.map((entry) => entry.code) },
  });

  if (dryRun) {
    console.log("Dry run complete. No database records were changed.");
    console.log(`Rows read: ${parsedCodes.length}`);
    console.log(`Unique codes: ${prepared.codes.length}`);
    console.log(`Duplicates in file: ${prepared.duplicatesInFile}`);
    console.log(`Already in database: ${existingCodes}`);
    console.log(`Ready to insert: ${prepared.codes.length - existingCodes}`);
    return;
  }

  const result = await AuthenticationCodeModel.bulkWrite(
    prepared.codes.map((code) => ({
      updateOne: {
        filter: { code: code.code },
        update: {
          $setOnInsert: {
            ...code,
          },
        },
        upsert: true,
      },
    })),
    { ordered: false },
  );

  console.log("Authentication-code import complete.");
  console.log(`Rows read: ${parsedCodes.length}`);
  console.log(`Unique codes: ${prepared.codes.length}`);
  console.log(`Duplicates in file: ${prepared.duplicatesInFile}`);
  console.log(`Already in database: ${existingCodes}`);
  console.log(`Inserted: ${result.upsertedCount}`);
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error
        ? error.message
        : "Authentication-code import failed.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectFromDatabase();
  });
