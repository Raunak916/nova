"use client";
import { Button  } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useRouter } from "next/router";
const Page = () => {
  const router = useRouter()
  const [value, setValue] = useState(" ")
  const trpc = useTRPC();
  const createProject = useMutation(trpc.projects.create.mutationOptions(
    {
      onError: (error) => {
        toast.error(error.message);
      },

      onSuccess: (data)=>{
        router.push(`/projects/${data.id}`);
        //yaahan data mtlb ek project ka data , jo naya create hota hai 
      }
    }
  ))
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto flex items-center justify-center flex-col gap-y-4">
        <Input value = { value } onChange={(e)=>{setValue(e.target.value)}} />
        <Button variant="ghost" className="mb-4"
        disabled = {createProject.isPending}
        onClick={() => { createProject.mutate({ value: value }) }}>
        Submit
        </Button>
      </div>
   </div>
  );
}


 
export default Page;

//csr sends just html with div id = root and Js renders it in browser
//ssr sends html with data in it, so no need to render it in browser
//difficult to know by naked eye if it is ssr or csr, but you can check the source code of the page
//if you see data in the source code, then it is ssr, if you see just html with div id = root, then it is csr


// “Instead of fetch('/api/something'), I can directly call a function like trpc.hello() and it talks to the server.”
//useTRPC()
// This hook gives you access to all the backend routes you defined using tRPC.
//
// So if you defined a route like createAI, this makes it available in your frontend.

// queryOptions prepares that function to be used with useQuery.

// useQuery(...)
// This is from React Query.

// It helps you fetch and cache data from your backend.

// So this line is saying:

// “Hey, go run the backend query createAI({ text: "Raunak" }) and give me the result as data.”