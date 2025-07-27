import { inngest } from "./client";
import {openai, createAgent} from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter"
import { getSandbox } from "./utils";

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
    system:"You are an expert next.js developer.You write readable and maintainable code.You write simple next.js and React snippets.",
    model:openai({
      model:"gpt-4o",
      apiKey:process.env.OPENAI_API_KEY,
    })
    }
    )

    const {output} = await codeAgent.run(
      `Write snippets for the following:${event.data.value}`
    )

    const sandboxUrl = await step.run("get-sandbox-url", async()=>{
      const sandbox = await getSandbox(sandboxId);
      const host = sandbox.getHost(3000);
      return `https://${host}`
    })
    return { output , sandboxUrl }
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
