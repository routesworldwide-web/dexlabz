import mongoose, { type Mongoose } from "mongoose";

import { getMongoDbUri } from "@/lib/env";

type MongooseCache = {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cache = globalThis.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalThis.mongooseCache = cache;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cache.connection) {
    return cache.connection;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(getMongoDbUri(), {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
      })
      .catch((error: unknown) => {
        cache.promise = null;
        throw error;
      });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}

export async function disconnectFromDatabase(): Promise<void> {
  await mongoose.disconnect();
  cache.connection = null;
  cache.promise = null;
}
