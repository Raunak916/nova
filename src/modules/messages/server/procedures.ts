import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany:baseProcedure
    .query(async()=>{
        //findMany return array of objects 
        const messages = await prisma.message.findMany({
            orderBy:{
                updatedAt:"desc"
            },
            include:{
                fragment:true
            }
        }
           
        )
        return messages;
    }),

    create: baseProcedure
    .input(
        z.object({
            value:z.string().min(1,{message:"Message cannot be empty"}),
        })
    )

    .mutation(async({ input })=>{
       const newMessage = await prisma.message.create({
            data:{
                content:input.value,
                role:"USER",
                type:"RESULT"
            }
        })

        await inngest.send({
            //event 
            name:"code-agent/run",
            data:{
                value:input.value
            }
        })

        return newMessage;
    })
}
)