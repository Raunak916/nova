import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany:baseProcedure
    .input(
            z.object({
            projectId:z.string().min(1,{message:"Project ID cannot be empty"})
            })
        )
    .query(async({ input })=>{
        //findMany return array of objects 
        const messages = await prisma.message.findMany({
            where:{
                projectId:input.projectId
            },
            include:{
                fragment:true
            },
            orderBy:{
                updatedAt:"asc"
            },
        }
           
        )
        return messages;
    }),

    create: baseProcedure
    .input(
        z.object({
            value:z.string()
               .min(1,{message:"Message cannot be empty"})
               .max(10000,{message:"Message too long"}),
            projectId:z.string().min(1,{message:"Project ID cannot be empty"})
        })
    )

    .mutation(async({ input })=>{
       const newMessage = await prisma.message.create({
            data:{
                projectId:input.projectId,
                content:input.value,
                role:"USER",
                type:"RESULT"
            }
        })

        await inngest.send({
            //event 
            name:"code-agent/run",
            data:{
                value:input.value,
                projectId:input.projectId
            }
        })

        return newMessage;
    })
}
)