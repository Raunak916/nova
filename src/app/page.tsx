
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import {Client} from './client';
import { Suspense } from 'react';
import { Client2 } from './client2';

const Page = async() => {
  //prefetching 

  const queryClient = getQueryClient();//getQueryClient() is a helper that creates (or reuses) a TanStack QueryClient
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({ text: "Raunak 1" }));
  void queryClient.prefetchQuery(trpc.createAI.queryOptions({text:"Raunak 2"}))
  return (  
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<div>Loading...</div>}>
        <Client />
        <Client2 />
      </Suspense>
    </HydrationBoundary>
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