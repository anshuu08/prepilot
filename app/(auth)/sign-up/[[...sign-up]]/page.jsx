
import { SignUp } from "@clerk/nextjs";
import React from "react";
const Page = () => {
  return <SignUp signInUrl="/sign-in" />  
};

export default Page;
