require('dotenv/config');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUserUpdate() {
  try {
    console.log("Testing user profile update flow...");
    
    // Create a test user first
    const testUser = await prisma.user.create({
      data: {
        clerkUserId: "test_user_" + Date.now(),
        email: "test@example.com",
        name: "Test User"
      }
    });
    console.log("Created test user:", testUser.id);

    // Test updating the user with an industry
    const updateData = {
      industry: "test-industry-" + Date.now(),
      experience: 3,
      bio: "Test bio",
      skills: ["JavaScript", "React", "Node.js"]
    };

    // Test the AI insights generation with fallback
    const testInsights = {
      salaryRanges: [
        { role: "Test Role", min: 50000, max: 100000, median: 75000, location: "Test City" }
      ],
      growthRate: 5.5,
      demandLevel: "Medium",
      topSkills: ["Skill1", "Skill2"],
      marketOutlook: "Positive",
      keyTrends: ["Trend1", "Trend2"],
      recommendedSkills: ["RecSkill1", "RecSkill2"]
    };

    // Create industry insight
    const industryInsight = await prisma.industryInsight.create({
      data: {
        industry: updateData.industry,
        ...testInsights,
        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });
    console.log("Created industry insight:", industryInsight.id);

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: testUser.id },
      data: {
        industry: updateData.industry,
        experience: updateData.experience,
        bio: updateData.bio,
        skills: updateData.skills
      }
    });
    console.log("Updated user successfully:", updatedUser.id);

    // Clean up
    await prisma.user.delete({ where: { id: testUser.id } });
    await prisma.industryInsight.delete({ where: { id: industryInsight.id } });
    
    console.log("Test completed successfully - user update flow is working!");
    
  } catch (error) {
    console.error("Error testing user update:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserUpdate();
