import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },                        // 1. Unique ID of the function
  { event: "test/hello.world" },                // 2. Event that triggers this function
  async ({ event, step }) => {                  // 3. Function body (async job)

    //suppose this is for video download 
    await step.sleep("wait-a-moment", "30s");
    
    //this step is for transcribe 
    await step.sleep("wait-a-moment", "10s");  
    
    //this step is for summarise
    await step.sleep("wait-a-moment", "5s");    


    return { message: `Hello ${event.data.email}!` };  // 5. Respond with a message
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
