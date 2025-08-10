import Link from "next/link"
import { CrownIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";

import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";

interface Props { 
    points:number 
    msBeforeNext:number
}

export const Usage = ({ points , msBeforeNext }: Props)=>{

    const { has } = useAuth();
    const hasProAccess = has?.({plan:"pro_user"})
    return(
        <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
            <p className="text-sm">
                        {points} { hasProAccess ? "pro" : "free" } credits remaining
                    </p>
            <div className="flex items-center gap-x-2">
                
                    <p className="text-muted-foreground text-xs">
                        Resets in {" "}
                        {
                            formatDuration(
                                intervalToDuration({
                                    start:new Date(),
                                    end:new Date(Date.now() + msBeforeNext)
                                }),
                            {
                                format:["months" , "days" , "hours"]
                            },   
                        )}
                    </p>
                    { !hasProAccess && (
                    <Button
                    variant={"ghost"}
                    size={"sm"}
                    className="ml-auto"
                    asChild
                    >
                        <Link href="/pricing">
                            <CrownIcon/> Upgrade
                        </Link>
                    </Button>
                   )}   
            </div>
        </div>
    )
}