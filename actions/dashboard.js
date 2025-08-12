"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIInsights(industry, retries = 2, delay = 500) {
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
    // Add a timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('AI generation timeout')), 8000)
    );
    
    const generationPromise = model.generateContent(prompt);
    
    const result = await Promise.race([generationPromise, timeoutPromise]);
    const response = result.response;
    const text = response.text();
    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    if ((error.status === 503 || error.message === 'AI generation timeout') && retries > 0) {
      console.warn(
        `${error.status === 503 ? '503' : 'Timeout'} received, retrying generateAIInsights for "${industry}" after ${delay}ms... (${retries} retries left)`
      );
      await new Promise((res) => setTimeout(res, delay));
      return generateAIInsights(industry, retries - 1, delay * 1.5);
    }
    
    // If all retries failed or it's a different error, return fallback data
    console.warn(`Failed to generate AI insights for "${industry}", using fallback data:`, error.message);
    return getFallbackInsights(industry);
  }
}

function getFallbackInsights(industry) {
  return {
    salaryRanges: [
      { role: "Entry Level", min: 40000, max: 60000, median: 50000, location: "General" },
      { role: "Mid Level", min: 60000, max: 90000, median: 75000, location: "General" },
      { role: "Senior Level", min: 90000, max: 130000, median: 110000, location: "General" },
      { role: "Manager", min: 100000, max: 150000, median: 125000, location: "General" },
      { role: "Director", min: 150000, max: 200000, median: 175000, location: "General" }
    ],
    growthRate: 5.0,
    demandLevel: "Medium",
    topSkills: ["Communication", "Problem Solving", "Technical Skills", "Leadership", "Industry Knowledge"],
    marketOutlook: "Neutral",
    keyTrends: ["Digital Transformation", "Remote Work", "Automation", "Sustainability", "Data Analytics"],
    recommendedSkills: ["Digital Literacy", "Adaptability", "Data Analysis", "Project Management", "Collaboration"]
  };
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

  // If user hasn't set an industry, return null
  if (!user.industry) {
    console.log("User has no industry set");
    return null;
  }

  // If no insights exist, generate them
  if (!user.industryInsight) {
    try {
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
    } catch (error) {
      console.error("Failed to generate or save industry insights:", error);
      // Return fallback insights if AI generation fails
      return normalizeInsights(getFallbackInsights(user.industry));
    }
  }

  console.log("Returning existing insight:", user.industryInsight);
  return normalizeInsights(user.industryInsight);
}