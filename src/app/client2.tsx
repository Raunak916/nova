"use client";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
export const Client2 = () =>{
    const trpc = useTRPC()
    const {data} = useSuspenseQuery(trpc.createAI.queryOptions({ text: "Raunak 2" }))

    return(
        <div>
            {JSON.stringify(data)}
        </div>
    )
}