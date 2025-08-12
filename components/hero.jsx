"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRef,imageRef, useEffect } from "react";



const HeroSection = ()=>{
    const imageRef = useRef(null)
    useEffect(() => {
    const imageElement = imageRef.current;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;

      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    },[]);//dependecy array
    return(
        <section className="w-full pt-36 md:pt-48 pb-10">
            <div className="space-y-6 text-center">
                <div className="space-y-6 mx-auto">
                    <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl xl:text-7xl">
                        Prep Made Easy  
                        <br />
                        — With Your Personal AI Coach
                    </h1>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                       Your one-stop AI-powered toolkit: Interview Prep, Resume Builder, DSA Sheets & More
                    </p>

                </div>
                <div className="flex justify-center space-x-4">
                    <Link href="/dashboard">
                      <Button size="lg" className="px-8">Get Started</Button>
                    </Link>

                    <Link href="https://chatgpt.com/">
                      <Button size="lg" className="px-8" variant="outline">Get Started</Button>
                    </Link>
                </div>

                <div className="hero-image-wrapper mt-5 md:mt-0">
                    <div ref={imageRef} className="hero-image">
                        <Image
                         src={"/banner.png"} 
                         width={1300}
                         height={720}
                         alt="banner preppilot"
                         className="rounded-lg shadow-2xl border mx-auto"
                         priority
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;


















//This code uses useRef to keep track of an image element and useEffect to run some logic when the page loads. Inside it, 
// we add a scroll event listener to the window. Every time the user scrolls, it checks how far they’ve scrolled down the page using
//  window.scrollY. If it’s more than 100 pixels, it adds a CSS class called .scrolled to the image, which triggers a smooth animation.
//  If they scroll back up, it removes that class. Finally, we clean up the scroll listener when the component is removed so that the app stays fast and bug-free. This way, your image reacts smoothly to scrolling.
