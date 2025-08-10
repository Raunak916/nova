import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { consumeCredits } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const messageRouter = createTRPCRouter({
    getMany:protectedProcedure
    .input(
            z.object({
            projectId:z.string().min(1,{message:"Project ID cannot be empty"})
            })
        )
    .query(async({ input , ctx })=>{
        //findMany return array of objects 
        const messages = await prisma.message.findMany({
            where:{
                projectId:input.projectId,
                project:{
                    userId:ctx.auth.userId
                }
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

    create: protectedProcedure
    .input(
        z.object({
            value:z.string()
               .min(1,{message:"Message cannot be empty"})
               .max(10000,{message:"Message too long"}),
            projectId:z.string().min(1,{message:"Project ID cannot be empty"})
        })
    )

    .mutation(async({ input , ctx })=>{
        //new message banane se pehle ek check kr rhe hai ki bhai aap authenticated ho yaa nhi otherwise nahi bana sakte 
        const existingProject = await prisma.project.findUnique({
            where:{
                id:input.projectId,
                userId:ctx.auth.userId
            }
        })
        if(!existingProject){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Project not found"
            })
        }

        try {
            await consumeCredits();
        } catch (error) {
            if(error instanceof Error){
                throw new TRPCError({
                    code:"BAD_REQUEST",
                    message:"Something went wrong "
                })
            }
            else{
                //iska matlab credits khatam ho gya hai 
                throw new TRPCError(
                    {
                        code:"TOO_MANY_REQUESTS",
                        message:"You have used all you credits"
                    }
                )
            }
        }
       const newMessage = await prisma.message.create({
            data:{
                projectId:existingProject.id,
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