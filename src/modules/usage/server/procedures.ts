import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
    status:protectedProcedure
    .query(async()=>{
        try {
            const result = await getUsageStatus();
            return result;
        } catch {
            return null;
        }
    })
})
// export const usageRouter = createTRPCRouter({
//     status: protectedProcedure
//     .query(async () => {
//         try {
//             const result = await getUsageStatus();
//             return result;
//         } catch (e) {
//             console.error("getUsageStatus error:", e);
//             throw e; // or return something like { error: e.message }
//         }
//     })
// })
