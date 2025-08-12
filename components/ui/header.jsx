import Link from "next/link";
import Image from "next/image";
import { SignedOut,SignedIn ,SignInButton,SignUpButton,UserButton} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ChevronDown, Laptop2Icon, LayoutDashboard, PenBox, StarsIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { checkUser } from "@/lib/checkUser";


const Header = async()=>{
   await checkUser();
    return(
        <header className="fixed top-0 w-full  bg-background/80 backdrop-blur-md z-50
        supports-[backdrop-filter]:bg-background/60
        ">
            {/* border-b border-border */}
             <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/">
                  <Image src="/logo.png" 
                  alt="Logo" 
                  width={3000} 
                  height={100} 
                  className="h-16 py-1 w-auto object-contain "
                  />
                </Link>

                <div className="flex items-center space-x-2 md:space-x-4">
                  <SignedIn>
                        <Link href={"/"}>
                           <Button variant="secondary">
                              <LayoutDashboard className="h-4 w-4" />
                               <span className="hidden md:block">Industry Insights</span>
                           </Button>
                        </Link>

                    <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button variant="secondary">
                              <StarsIcon className="h-4 w-4" />
                              <span className="hidden md:block">LevelUp Tools</span>
                              <ChevronDown className="h-4 w-4" />
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent>
                        <DropdownMenuItem>
                            <Link href={"/resume"} className="flex items-center gap-2">
                              <LayoutDashboard className="h-4 w-4" />
                              <span>Build Resume</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={"/ai-cover-letter"} className="flex items-center gap-2">
                              <PenBox className="h-4 w-4" />
                              <span>Cover Letter</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href={"/interview"} className="flex items-center gap-2">
                              <Laptop2Icon className="h-4 w-4" />
                              <span>Interview Prep</span>
                           </Link>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                    </DropdownMenu>
                  </SignedIn>  
                      <SignedOut>
                         <Link href="/sign-in">
                           <Button variant="outline">Sign In</Button>
                         </Link>
                     </SignedOut>
                    <SignedIn>
                     <UserButton 
                     afterSignOutUrl="/"
                     />
                    </SignedIn>
                </div>
             </nav>


             
        </header>
    )
}
export default Header;