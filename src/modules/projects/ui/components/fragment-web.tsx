import { Fragment } from "@/generated/prisma/wasm";
import { useState } from "react";
import {  ExternalLinkIcon , RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/hint";


interface Props{
    data: Fragment;
}

export const FragmentWeb = ({ data }:Props)=>{
    const [fragmentKey, setFragmentKey] = useState(0);
    const [copied , setCopied] = useState(false);

    const onRefresh = ()=>{
        setFragmentKey((prev)=> prev+1)
    }
    const handleCopy = ()=>{
        navigator.clipboard.writeText(data.sandboxURL)
        setCopied(true)
        setTimeout(()=>{
            setCopied(false)
        },2000)
    }

    return(
        <div className="flex flex-col w-full h-full">
            <div className="p-2 border-b bg-sidebar flex items-center gap-x-2 ">
                <Hint text="Refresh" side="bottom" align="start">
                   <Button size='sm' variant="outline" onClick={onRefresh}>
                       <RefreshCcwIcon />
                   </Button> 
                </Hint>

               <Hint text="copy to clipboard" side="bottom" align="start" >
                   <Button 
                   size='sm' 
                   variant="outline" 
                   onClick={handleCopy}
                   disabled = {copied || !data.sandboxURL}
                   className="flex-1 justify-start text-start font-normal">
                       <span className="truncate">
                        {data.sandboxURL}
                       </span>
                   </Button> 
                </Hint>

               <Hint text="Open in a new tab" side="bottom" align="start">
                   <Button 
                   disabled = {!data.sandboxURL}
                   variant="outline"
                   size='sm'
                   onClick={()=>{
                    if(!data.sandboxURL) return;
                    window.open(data.sandboxURL, "_blank");
                   }}
                   >
                       <ExternalLinkIcon />
                   </Button>
               </Hint>
            </div>
            <iframe 
            key={fragmentKey}
            className="w-full h-full"
            sandbox="allow-forms allow-scripts allow-same-origin"
            loading="lazy"
            src={data.sandboxURL}
            />
        </div>
    )
}