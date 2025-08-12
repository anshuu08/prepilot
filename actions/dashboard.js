"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIInsights(industry, retries = 3, delay = 1000) {
  const prompt = `
    Analyze the current state of the ${industry} industry and provide insights in ONLY the following JSON format without any additional notes or explanations:
    {
      "salaryRanges": [
        { "role": "string", "min": number, "max": number, "median": number, "location": "string" }
      ],
      "growthRate": number,
      "demandLevel": "High" | "Medium" | "Low",
      "topSkills": ["skill1", "skill2"],
      "marketOutlook": "Positive" | "Neutral" | "Negative",
      "keyTrends": ["trend1", "trend2"],
      "recommendedSkills": ["skill1", "skill2"]
    }
    
    IMPORTANT: Return ONLY the JSON. No additional text, notes, or markdown formatting.
    Include at least 5 common roles for salary ranges.
    Growth rate should be a percentage.
    Include at least 5 skills and trends.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    if (error.status === 503 && retries > 0) {
      console.warn(
        `503 received, retrying generateAIInsights for "${industry}" after ${delay}ms... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, delay));
      return generateAIInsights(industry, retries - 1, delay * 2);
    }
    throw error;
  }
}

function normalizeInsights(data) {
  return {
    ...data,
    growthRate: typeof data.growthRate === "number" ? data.growthRate : 0,
    demandLevel: ["High", "Medium", "Low"].includes(data.demandLevel) ? data.demandLevel : "Medium",
    topSkills: Array.isArray(data.topSkills) ? data.topSkills : [],
    marketOutlook: ["Positive", "Neutral", "Negative"].includes(data.marketOutlook) ? data.marketOutlook : "Neutral",
    keyTrends: Array.isArray(data.keyTrends) ? data.keyTrends : [],
    recommendedSkills: Array.isArray(data.recommendedSkills) ? data.recommendedSkills : [],
    salaryRanges: Array.isArray(data.salaryRanges) ? data.salaryRanges : [],
  };
}

export async function getIndustryInsights() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    include: {
      industryInsight: true,
    },
  });

  if (!user) throw new Error("User not found");

  // If no insights exist, generate them
  if (!user.industryInsight) {
    const insights = await generateAIInsights(user.industry);

    const industryInsight = await db.industryInsight.create({
      data: {
        industry: user.industry,
        ...insights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

     console.log("Saved industryInsight:", industryInsight);

    return normalizeInsights(industryInsight);
  }

  console.log("Returning existing insight:", user.industryInsight);
  return normalizeInsights(user.industryInsight);
}