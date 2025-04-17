import { PrismaClient } from "@prisma/client";

// Extend globalThis to include prisma
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize PrismaClient with error handling
let db: PrismaClient;

try {
  // Reuse existing instance if available (for development hot-reloading)
  if (process.env.NODE_ENV !== "production" && globalThis.prisma) {
    db = globalThis.prisma;
  } else {
    db = new PrismaClient();
  }

  // Store the instance in globalThis only in non-production environments
  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = db;
  }
} catch (error) {
  console.error("Failed to initialize PrismaClient:", error);
  // Optionally, throw the error or handle it based on your app's needs
  throw new Error("PrismaClient initialization failed");
}

export { db };
