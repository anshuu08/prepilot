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
    let industrySlug = (typeof data.industry === "string" && data.industry.trim() !== "") ? data.industry.trim() : null;
    console.log("[updateUser] using industrySlug:", industrySlug);

    // Generate AI insights outside of transaction if needed
    let insights = null;
    if (industrySlug) {
      const existingInsight = await db.industryInsight.findUnique({
        where: { industry: industrySlug },
      });
      console.log("[updateUser] found existing industryInsight:", !!existingInsight);

      if (!existingInsight) {
        console.log("[updateUser] generating AI insights for:", industrySlug);
        try {
          insights = await generateAIInsights(industrySlug);
          console.log("[updateUser] AI insights generated successfully");
        } catch (aiError) {
          console.error("[updateUser] AI generation failed:", aiError.message);
          // Continue without insights - the transaction will handle the fallback
          insights = null;
        }
      }
    }

    // Now run the database operations in a transaction
    await db.$transaction(
      async (tx) => {
        // Create industry insight if we generated one
        if (insights && industrySlug) {
          try {
            await tx.industryInsight.create({
              data: {
                industry: industrySlug,
                ...insights,
                nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              },
            });
            console.log("[updateUser] created new industryInsight for:", industrySlug);
          } catch (createError) {
            // Handle race condition where another request created the insight
            if (createError.code === 'P2002') {
              console.log("[updateUser] industryInsight already exists (race condition), continuing...");
            } else {
              throw createError;
            }
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
      { timeout: 15000 } // Increased timeout to 15 seconds
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


