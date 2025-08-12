import {industries} from "@/data/industries"
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import OnBoardingForm from "./-components/onboarding-form";

// app/(main)/onboarding/page.jsx

export const dynamic = "force-dynamic";

export default async function OnBoardingPage() {
  return (
    <main>
      <OnBoardingForm industries={industries} />
    </main>
  );
}

