import { inngest } from "./client";
import {openai, createAgent , createTool, createNetwork} from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter"
import { getSandbox , lastAssistantTextMessageContent } from "./utils";
import z from "zod";
import { PROMPT } from "@/prompt";
import { title } from "process";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },                        // 1. Unique ID of the function
  { event: "test/hello.world" },                // 2. Event that triggers this function
  async ({ event, step}) => {                  // 3. Function body (async job)

    const sandboxId = await step.run("get-sandbox-id", async()=>{
      const sandbox = await Sandbox.create("nova-nextjs-test")
      return sandbox.sandboxId;
    })

    const codeAgent = createAgent(
   { 
    name:"code-agent",
    system:PROMPT,
    description:"An expert coding agent",
    model:openai({
      model:"gpt-4.1",
      apiKey:process.env.OPENAI_API_KEY,
      defaultParameters:{
        temperature:0.1
      },
    }),
    tools:[
      createTool({
        name:"terminal",
        description:"Use the terminal to run commands",
        parameters:z.object({
          command:z.string(),
        }),
        handler:async({ command } , { step })=>{
          return await step?.run("terminal", async()=>{
            const buffers ={ stdout:"" , stderr:""};
            const sandbox = await getSandbox(sandboxId);
           try {
             const result = await sandbox.commands.run(command,{
              onStdout: (chunk:string)=>{
                buffers.stdout += chunk;
              },
              onStderr: (chunk:string)=>{
                buffers.stderr += chunk;
              }
            })
            return buffers.stdout
           } catch (e) {
            console.error(
              `Command Failed:${e} \n stdout:${buffers.stdout} \n stderr:${buffers.stderr}`
            )
            return `Command Failed:${e} \n stdout:${buffers.stdout} \n stderr:${buffers.stderr}`
           }
          })
        }
      }),


      createTool({
        name:"createOrUpdateFiles",
        description:"Create or update files in the Sandbox",
        parameters:z.object({
          files:z.array(
            z.object({
              path:z.string(),
              content:z.string()
            })
          )
        }),
        handler: async ({ files } , { step , network })=>{
          const newFiles = await step?.run("createOrUpdateFiles", async()=>{
            try{
              const updatedFiles = network.state.data.files || {};
              const sandbox = await getSandbox(sandboxId);
              for(const file of files){
                await sandbox.files.write(file.path , file.content)
                updatedFiles[file.path] = file.content;
              }
              return updatedFiles;
            }catch(e){
              return "Error"+ e;
            }
          })
          if(typeof newFiles === "object"){
            network.state.data.files = newFiles
          }
        }
      }),

      createTool({
        name:"readFiles",
        description:"Read files from the Sandbox",
        parameters:z.object({
          files:z.array(
            z.string()
          )
        }),
        handler:async({ files }, { step })=>{
          return await step?.run("readFiles", async()=>{
            try{
              const contents = [];
              const sandbox = await getSandbox(sandboxId);
              for( const file of files){
                const content = await sandbox.files.read(file);
                contents.push({path:file , content:content});
              }
              return JSON.stringify(contents);
            }catch(e){
              return "Error"+ e;
            }
          })
        }
      })
    ],
    lifecycle:{
      onResponse:async({ result, network })=>{
        const lastAssistantTextMessage = await lastAssistantTextMessageContent(result);
        if(lastAssistantTextMessage && network){
          if(lastAssistantTextMessage.includes("<task_summary>")){
            network.state.data.summary = lastAssistantTextMessage;
          }
        }
        return result;
      }  
    }
    
   
  })

    const network = createNetwork({
      name:"codeAgent-network",
      agents:[codeAgent],
      maxIter:15,
      router:async({ network})=>{
        const summary = network.state.data.summary;

        if(summary){
          return 
        }
        return codeAgent;// ✅ If no summary, run the codeAgent
      }
    })

   const result = await network.run(event.data.value);


    const sandboxUrl = await step.run("get-sandbox-url", async()=>{
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`
    })
    return { 
      url:sandboxUrl,
      title:"Fragment", 
      summary:result.state.data.summary,
      files:result.state.data.files,
    }
  },
);


//the data here can be passed from the client side and the we can use it for our pupose 
//the data can be anything from a link of an image or a link to an youtube video we want to summarise or a pdf file we want to summarise

// If you want to trigger this function, you’d send this event to Inngest:

// {
//   "name": "test/hello.world",
//   "data": {
//     "email": "raunak@example.com"
//   }
// }
