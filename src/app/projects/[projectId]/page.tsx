import { ProjectView } from "@/modules/projects/ui/views/project-view"
import { getQueryClient, trpc } from "@/trpc/server"
import { dehydrate, HydrationBoundary } from "@tanstack/react-query"


interface Props{
    params:Promise<{
        projectId:string
    }>
}

const Page = async({ params }:Props) => {
    const { projectId } = await params 

    const queryClient = getQueryClient();
    //storing in server cache , so that client components dont need to refetch it every time
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId:projectId
    }))
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id:projectId
    }))
    return(
        <HydrationBoundary state={dehydrate(queryClient)}> {/* passing the data from server-cache to client-cache */}
            
               <ProjectView projectId={projectId}/>{/*just fetches it from cache */}
      
        </HydrationBoundary>
)
}
export default Page;