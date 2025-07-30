import { inngest } from "@/inngest/client";
import prisma from "@/lib/db";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import z from "zod";
import { generateSlug } from "random-word-slugs";

export const projectsRouter = createTRPCRouter({
    getOne:baseProcedure
    .input(
        z.object({
            id:z.string().min(1,{ message: "Id is compulsory" })
        })
    )
    .query(async({ input })=>{
        //findMany return array of objects 
        const existingProject = await prisma.project.findUnique({
            where:{
                id:input.id
            }
        }
           
        )
        return existingProject ;
    }),
    getMany:baseProcedure
    .query(async()=>{
        //findMany return array of objects 
        const projects = await prisma.project.findMany({
            orderBy:{
                updatedAt:"desc"
            },
        }
           
        )
        return projects ;
    }),

    create: baseProcedure
    .input(
        z.object({
            value:z.string()
            .min(1,{message:"Message cannot be empty"})
            .max(10000,{message:"Message too long"}),
        })
    )

    .mutation(async({ input })=>{
        const newProject = await prisma.project.create({
            //install a generator package(random-word-slug) for project name and stuff
            data:{
                name:generateSlug(2,{
                    format:"kebab"
                }),
                messages:{
                    create:[{
                        content:input.value,
                        role:"USER",
                        type:"RESULT"
                    }]
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