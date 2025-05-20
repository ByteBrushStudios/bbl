import { PrismaClient } from "@prisma/client";

declare global {
    var prisma: PrismaClient | undefined;
}

let prismaInstance: PrismaClient;

try {
    prismaInstance = globalThis.prisma ?? new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "info", "warn", "error"] : ["error"]
    });

    if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaInstance;
} catch (error) {
    console.error("PrismaClient initialization failed:", error);
    throw error;
}

export const prisma = prismaInstance;