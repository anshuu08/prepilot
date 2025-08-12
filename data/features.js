import { BrainCircuit, Briefcase, LineChart, ScrollText } from "lucide-react";

export const features = [
  {
    icon: <BrainCircuit className="w-10 h-10 mb-4 text-primary" />,
    title: "AI Career Coach",
    description:
      "Get smart, personalized career support that grows with you — from goals to guidance.",
  },
  {
    icon: <Briefcase className="w-10 h-10 mb-4 text-primary" />,
    title: "Ace Interviews",
    description:
      "Practice real-world questions with instant AI feedback to boost your confidence and clarity.",
  },
  {
    icon: <LineChart className="w-10 h-10 mb-4 text-primary" />,
    title: "Live Insights",
    description:
      "Track salary trends, top roles, and skills in demand — all tailored to your domain.",
  },
  {
    icon: <ScrollText className="w-10 h-10 mb-4 text-primary" />,
    title: "Smart Resumes",
    description:
      "Generate job-ready, ATS-friendly resumes in seconds — no formatting stress required.",
  },
];
export default features;