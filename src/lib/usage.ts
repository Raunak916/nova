// 
import { RateLimiterPrisma } from "rate-limiter-flexible";
import { auth } from "@clerk/nextjs/server";
import prisma from "./db";

const DURATION = 30 * (24 * 60 * 60); // 30 days
const FREE_POINTS = 3;
const GENERATION_COST = 1;
const PRO_POINTS = 80;

async function getUsageTracker() {

  if (!prisma?.$connect) {
    throw new Error(
      "Prisma Client is not generated. Run `npx prisma generate` before starting the server."
    );
  }

  const { has } = await auth(); 
  const hasProAcccess = has({plan:"pro_user"})

  return new RateLimiterPrisma({
    storeClient: prisma,
    tableName: "Usage",
    points: hasProAcccess? PRO_POINTS : FREE_POINTS,
    duration: DURATION,
  });
}

export async function consumeCredits() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.consume(userId, GENERATION_COST);

  return result;
}

export async function getUsageStatus() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("User is not authenticated");
  }

  const usageTracker = await getUsageTracker();
  const result = await usageTracker.get(userId);
  return result;
}
