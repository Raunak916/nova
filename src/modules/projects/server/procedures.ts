import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
    getOne:protectedProcedure
    .input(
        z.object({
            id:z.string().min(1,{ message: "Id is compulsory" })
        })
    )
    .query(async({ input , ctx  })=>{
        
        const existingProject = await prisma.project.findUnique({
            where:{
                id:input.id,
                userId:ctx.auth.userId
            }
        })
        if(!existingProject){
            throw new TRPCError({
                code:"NOT_FOUND",
                message:"Project not found"
            })
        }
        return existingProject ;
    }),
    
    getMany:protectedProcedure
    .query(async( { ctx })=>{
        //findMany return array of objects 
        const projects = await prisma.project.findMany({
            where:{
                userId:ctx.auth.userId
            },
            orderBy:{
                updatedAt:"desc"
            },
        }
           
        )
        return projects ;
    }),

    create: protectedProcedure
    .input(
        z.object({
            value:z.string()
            .min(1,{message:"Message cannot be empty"})
            .max(10000,{message:"Message too long"}),
        })
    )

    .mutation(async({ input , ctx })=>{
        const newProject = await prisma.project.create({
            //install a generator package(random-word-slug) for project name and stuff
            data:{
                name:generateSlug(2,{
                    format:"kebab"
                }),
                userId:ctx.auth.userId,
                messages:{
                    create:[{
                        content:input.value,
                        role:"USER",
                        type:"RESULT"
                    },]
                }
            }
        });

        await inngest.send({
            //event 
            name:"code-agent/run",
            data:{
                value:input.value,
                projectId:newProject.id,
            }
        })

        return newProject;
    })
}
)