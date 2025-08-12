"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "@/actions/dashboard";

export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  // Debug: log incoming industry value
  console.log("[updateUser] received industry:", data.industry);

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  try {
    await db.$transaction(
      async (tx) => {
        let industrySlug = (typeof data.industry === "string" && data.industry.trim() !== "") ? data.industry.trim() : null;
        console.log("[updateUser] using industrySlug:", industrySlug);

        // Only update if industrySlug is not null
        if (industrySlug) {
          let industryInsight = await tx.industryInsight.findUnique({
            where: { industry: industrySlug },
          });
          console.log("[updateUser] found industryInsight:", !!industryInsight);

          if (!industryInsight) {
            const insights = await generateAIInsights(industrySlug);
            await tx.industryInsight.create({
              data: {
                industry: industrySlug,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
            console.log("[updateUser] created new industryInsight for:", industrySlug);
          }
        }

        const skillsArray = Array.isArray(data.skills)
          ? data.skills
          : typeof data.skills === "string"
          ? data.skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [];

        const updatedUser = await tx.user.update({
          where: { id: user.id },
          data: {
            industry: industrySlug,                // null if empty
            experience: data.experience ?? null,   // normalize
            bio: data.bio?.trim() || "",
            skills: skillsArray,
          },
        });
        console.log("[updateUser] updated user industry to:", updatedUser.industry);
      },
      { timeout: 10000 }
    );

    // Revalidate both pages that gate on onboarding
    revalidatePath("/dashboard");
    revalidatePath("/onboarding");

    return { success: true };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) return { isOnboarded: false };

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: { industry: true },
  });

    console.log("[getUserOnboardingStatus] industry:", user?.industry);

   return { isOnboarded: !!user?.industry };
}


