"use client";
import Link from "next/link";
import LogoImage from "@/app/components/logo-image";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    SignUpButton,
  } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { UserControl } from "@/components/user-control";

export const Navbar = ()=>{
    return(
        <nav
        className="p-4 bg-transparent fixed top-0 left-0 right-0 z-50 transition-all duration-200
        border-b border-transparent"
        >
            <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <Link href={"/"} className="flex items-center gap-2">
                  <LogoImage size={24}/>
                  <span className="font-semibold text-lg">NovaAI</span>
                </Link>
                <SignedOut>
                    <div className="flex gap-2">
                        <SignUpButton>
                            <Button variant={"outline"} size={"sm"}>
                                Sign Up
                            </Button>
                        </SignUpButton>
                        <SignInButton>
                            <Button size={"sm"}> 
                                Sign In
                            </Button>
                        </SignInButton>
                    </div>
                </SignedOut>
                <SignedIn>
                    <UserControl showName/>
                </SignedIn>
            </div>
        </nav>
    )
}
