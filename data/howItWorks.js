import { UserPlus, FileEdit, Users, LineChart } from "lucide-react";

export const howItWorks = [
  {
    title: "Quick Onboarding",
    description: "Tell us your background once — get tailored support forever.",
    icon: <UserPlus className="w-8 h-8 text-primary" />,
  },
  {
    title: "Build Your Docs",
    description: "Create eye-catching, ATS-proof resumes and cover letters in minutes.",
    icon: <FileEdit className="w-8 h-8 text-primary" />,
  },
  {
    title: "Ace Interviews",
    description: "Train with smart mock interviews that mirror real hiring rounds.",
    icon: <Users className="w-8 h-8 text-primary" />,
  },
  {
    title: "Track Results",
    description: "See how you're growing with visual insights and AI feedback.",
    icon: <LineChart className="w-8 h-8 text-primary" />,
  },
];
export default howItWorks;