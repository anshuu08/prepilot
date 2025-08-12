"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { onboardingSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const slugify = (s = "") =>
  s.toString().trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const OnBoardingForm = ({ industries }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(
    industries[0] || null
  );
  const router = useRouter();

  const {
    loading: updateLoading,
    fetchFn: updateUserFn,
    data: updateResult,
    error: updateError,
  } = useFetch(updateUser);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset, // <-- add reset here
  } = useForm({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      industry: industries[0]?.id || "",
      subIndustry: "",
      experience: "",
      skills: "",
      bio: "",
    },
  });

  // Update selectedIndustry when industry changes
  useEffect(() => {
    const sel = industries.find((ind) => ind.id === watch("industry")) || null;
    setSelectedIndustry(sel);
  }, [watch("industry"), industries]);

  // Surface server action errors
  useEffect(() => {
    if (updateError) {
      toast.error("Something went wrong while saving profile.");
      console.error(updateError);
    }
  }, [updateError]);

  // Navigate on success (the server action should return { success: true })
  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile completed successfully!");
      reset(); // <-- clear the form
      router.push("/dashboard");
      router.refresh(); // ensure fresh server data
    }
  }, [updateResult, updateLoading, router, reset]);

  const onSubmit = async (values) => {
    // Fallback: if industry is missing, use selectedIndustry.id
    const industryValue = values.industry || selectedIndustry?.id || industries[0]?.id || "";
    const sub = slugify(values.subIndustry || "");
    let formattedIndustry = industryValue;
    if (industryValue && sub.length > 0) {
      formattedIndustry = `${industryValue}-${sub}`;
    }
    if (!industryValue) {
      formattedIndustry = null;
    }
    console.log("[OnboardingForm] onSubmit values:", { ...values, industry: industryValue });
    await updateUserFn({
      industry: formattedIndustry,
      experience: Number(values.experience) || null,
      skills: typeof values.skills === "string"
        ? values.skills.split(",").map(s => s.trim()).filter(Boolean)
        : Array.isArray(values.skills) ? values.skills : [],
      bio: typeof values.bio === "string" ? values.bio : "",
    });
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2 shadow-none border-0 bg-transparent">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete your profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex">
              {/* Industry */}
              <div className="space-y-4">
                <Label htmlFor="industry">Industry</Label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        // Only reset subIndustry, not industry
                        setValue("subIndustry", "");
                        setSelectedIndustry(industries.find((ind) => ind.id === value) || null);
                      }}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select an industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((ind) => (
                          <SelectItem value={ind.id} key={ind.id}>
                            {ind.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <input type="hidden" {...register("industry")} />
                {errors.industry && (
                  <p className="text-sm text-red-500">{errors.industry.message}</p>
                )}
              </div>

              {/* Sub-Industry */}
              <div className="space-y-4 ml-6">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Controller
                  control={control}
                  name="subIndustry"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger id="subIndustry">
                        <SelectValue placeholder="Select a sub industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedIndustry?.subIndustries || []).map((label) => (
                          <SelectItem value={label} key={label}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <input type="hidden" {...register("subIndustry")} />
                {errors.subIndustry && (
                  <p className="text-sm text-red-500">{errors.subIndustry.message}</p>
                )}
              </div>
            </div>
            <br />
            {/* Experience */}
            <div className="space-y-4">
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                max="50"
                placeholder="Enter years of experience"
                {...register("experience")}
              />
              {errors.experience && (
                <p className="text-sm text-red-500">
                  {errors.experience.message}
                </p>
              )}
            </div>
            <br />
            {/* Skills */}
            <div className="space-y-4">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="E.g. Python, JavaScript, Product Management, Data Analysis..."
                {...register("skills")}
              />
              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>
              {errors.skills && (
                <p className="text-sm text-red-500">
                  {errors.skills.message}
                </p>
              )}
            </div>
            <br />
            {/* Bio */}
            <div className="space-y-4">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Write a short professional bio..."
                {...register("bio")}
              />
              {errors.bio && (
                <p className="text-sm text-red-500">
                  {errors.bio.message}
                </p>
              )}
            </div>
            {/* Submit */}
            <CardFooter className="mt-6">
              <button
                type="submit"
                disabled={updateLoading}
                className="px-4 py-2 bg-white text-black rounded-lg border border-gray-300 hover:bg-gray-100 transition w-full"
              >
                {updateLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Complete Profile"
                )}
              </button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnBoardingForm;