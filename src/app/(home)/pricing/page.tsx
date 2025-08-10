"use client";
import { PricingTable } from "@clerk/nextjs";
import LogoImage from "@/app/components/logo-image";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";

const Page  = ()=>{
    const currentTheme = useCurrentTheme();
    return(
        <div className="flex flex-col max-w-3xl mx-auto w-full">
            <section className="space-y-6  pt-[16vh] 2xl:py-48">
                <div className="flex flex-col items-center">
                    <div className="hidden md:block">
                        <LogoImage size={50} />
                    </div>
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
                <p className="text-muted-foreground text-center text-sm md:text-base">
                    Choose the Plan that fits your needs
                </p>
              <PricingTable
                appearance={{
                    elements:{
                        pricingTableCard:"border! shadow-none! rounded-lg!"
                    },
                    baseTheme: currentTheme === 'dark' ? dark: undefined
                }}
              />
            </section>
        </div>
    )
}
export default Page;