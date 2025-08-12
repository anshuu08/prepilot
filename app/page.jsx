import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import features from "@/data/features"; 
import HeroSection from "@/components/hero";
import howItWorks from "@/data/howItWorks";
import testimonial from "@/data/testimonial";
import faqs from "@/data/faqs";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div> 
      <div className="grid-background"></div>
      <HeroSection />
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background"> 
       <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
          Fuel Your Ambitions with Powerful AI Tools
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {features.map((feature,index)=>{
           return(
            <Card
              key={index}
              className="border-2 border-gray-200 hover:border-blue-500 transition-colors duration-300"
            >
               <CardContent className="pt-6 text-center flex flex-col items-center">
                 <div className="flex flex-col items-center justify-center">
                  {feature.icon}
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
               </CardContent>
             </Card>


           )
        })}</div>
      </div>
    </section>

    <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-900 text-white"> 
       <div className="container mx-auto px-4 md:px-6">
         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center justify-center">
             <h3 className="text-lg font-bold">50+</h3>
             <p className="text-sm text-muted-foreground">Industries Covered</p>
          </div>
          <div className="flex flex-col items-center justify-center">
             <h3 className="text-lg font-bold">1000+</h3>
             <p className="text-sm text-muted-foreground">Interview Questions</p>
          </div>
          <div className="flex flex-col items-center justify-center">
             <h3 className="text-lg font-bold">95%</h3>
             <p className="text-sm text-muted-foreground">Success Rate</p>
          </div>
          <div className="flex flex-col items-center justify-center">
             <h3 className="text-lg font-bold">24/7</h3>
             <p className="text-sm text-muted-foreground">AI-support</p>
          </div>   
         </div>
      </div>
    </section>


    <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-t border-muted shadow-sm">
       <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
           <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
            Step Into Success with Smart Career Moves
           </h2>
           <p className="text-base text-muted-foreground">
              Discover the four simple steps that guide you from preparation to placement — powered by AI and expert insight.
           </p>  
        </div>

         <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-auto">
          {howItWorks.map((item,index)=>{
           return(
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>

           )
        })}</div>
      </div>
    </section>


    <section className="w-full py-12 md:py-24 lg:py-32 bg-neutral-900 text-white"> 
       <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter text-center mb-12">
          What our users say
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3  gap-8 mx-auto">
          {testimonial.map((testimonial,index)=>{
           return(
            <Card
              key={index}
              className="bg-background">
               <CardContent className="pt-6">
                 <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative h-12 w-12 flex-shrink-0">
                      <Image width={40}
                             height={40}
                             src={testimonial.image}
                             alt ={testimonial.author}
                             className="rounded-full object-cover border-2 border-primary/20"
                       />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-sm text-primary">{testimonial.company}</p>
                    </div>
                  </div>
                  <blockquote>
                    <p className="text-muted-foreground italic relative">
                      <span className="text-3xl text-primary absolute -top-4 -left-2">“</span>
                          {testimonial.quote}
                      <span className="text-3xl text-primary absolute -bottom-4 right-0">”</span>
                    </p>
                  </blockquote>
                 </div>
               </CardContent>
             </Card>


           )
        })}</div>
      </div>
    </section>

    <section className="w-full py-12 md:py-24 lg:py-32 bg-background border-t border-muted shadow-sm">
       <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
           <h2 className="text-3xl font-bold tracking-tight text-center mb-4">
             Frequently asked Questions
           </h2>
           <p className="text-base text-muted-foreground">
              Find answers to common questions
           </p>  
        </div>

         <div className="max-w-6xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq,index)=>{
             return(
             <AccordionItem key = {index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
             </AccordionItem>
           )
          })}
          </Accordion>
          </div>
      </div>
    </section>

    <section className="w-full">
       <div className="mx-auto py-24 gradient rounded-lg">
        <div className="flex flex-col items-center text-center space-y-4 justify-center max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-5xl">
             Supercharge your career journey today
           </h2>
           <p className="mx-auto max-w-[600px] text-black md:text-xl">
              Accelerate your career with AI — just like thousands of professionals already have
           </p>
           

             <Link href="/dashboard" passHref>
              <Button
               size="lg"
               variant="secondary"
               className="h-11 mt-5 animate-bounce bg-black text-white "
              >
                 Start Your Journey Today
              <ArrowRight className="ml-2 h-4 w-4" />
             </Button>
            </Link>
  
        </div>

         
      </div>
    </section>


    </div>

    
    
  );
}
