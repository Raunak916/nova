import { CopyCheckIcon ,CopyIcon } from "lucide-react";
import { useState, useMemo, useCallback, Fragment} from "react";

import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { CodeView } from "./code-view";

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    BreadcrumbEllipsis
} from "@/components/ui/breadcrumb";

import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";

type FileCollection = { [path:string] :string};// [ ] for multiple paths ( mtlb ek se zyada pths honge but string : string )

function getLanguageFromExtension(filename: string): string{
    const extension = filename.split('.').pop()?.toLowerCase();
    return extension || "text"
}

interface FileBreadCrumbProps{
    filePath: string ,
}

const FileBreadCrumb = ({ filePath }:FileBreadCrumbProps)=>{
    const pathSegments = filePath.split('/')
    const maxSegments = 4 ;

    const renderBreadCrumbItems = ()=>{
        if(pathSegments.length <= maxSegments){
            //toh hum dikhayenge saara path 
            return pathSegments.map((segment , index)=>{
                const isLast = index === pathSegments.length - 1 ;
                return(
                    <Fragment
                    key={index}
                    >
                        <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage className="font-medium">
                                {segment}
                            </BreadcrumbPage>
                        ):(
                            <span className="text-muted-foreground">
                                {segment}
                            </span>
                        )}
                        </BreadcrumbItem>
                        {!isLast && <BreadcrumbSeparator />}
                    </Fragment>
                )
            })

        }else{
            //ellipsis ki madat se ... krdenge 
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];
            return(
                <BreadcrumbItem>
                  <span className="text-muted-foreground">
                    {firstSegment}
                  </span>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                <BreadcrumbItem>
                   <BreadcrumbPage className="font-medium">
                     {lastSegment}
                   </BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbItem>
            )
        }
    }

    return(
        <Breadcrumb>
          <BreadcrumbList>
            {renderBreadCrumbItems()}
          </BreadcrumbList>
        </Breadcrumb>
    )
}

interface FileExplorerProps{
    files: FileCollection
}


export const FileExplorer = ({ files }: FileExplorerProps)=>{
    const [copied , setCopied ] = useState(false);

    const [selectedFile, setSelectedFile] = useState<string | null>(()=>{
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null ;// we have the first file selected by default
    });

    const treeData = useMemo(()=>{
        return convertFilesToTreeItems(files);
    },[files])

    const handleFileSelect = useCallback((
        filePath: string
    )=>{
        if(files[filePath]){
            setSelectedFile(filePath)
        }
    },[files])

    const handleCopy = ()=>{
    navigator.clipboard.writeText(files[selectedFile || ""])
    setCopied(true)
    setTimeout(()=>{
        setCopied(false)
    },2000)
    }

    return(
        <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={30} minSize={20} className="bg-sidebar">
                <TreeView
                data = {treeData}
                value = {selectedFile}
                onSelect = {handleFileSelect}
                />
            </ResizablePanel>
            <ResizableHandle className="hover:bg-primary transition-colors" withHandle />
            <ResizablePanel defaultSize={70} minSize={50}>
              {selectedFile && files[selectedFile] ? (
                <div className="flex flex-col h-full w-full">
                    <div className="border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2">
                        {/*TODO FILE BREADCRUMB */}
                        <FileBreadCrumb filePath={selectedFile} />
                        <Hint text="copy to clipboard" align="start" side="bottom">
                            <Button
                            variant="outline"
                            size="icon"
                            className="ml-auto"
                            onClick={handleCopy}
                            disabled = {copied}
                            >
                                {!!copied ? (
                                    <CopyCheckIcon />
                                ):(
                                    <CopyIcon />
                                )}
                            </Button>
                        </Hint>
                    </div>
                    <div
                    className=" flex-1 overflow-auto w-full h-full p-4">
                        <CodeView 
                        code={files[selectedFile]}
                        lang={getLanguageFromExtension(selectedFile)}
                        />
                    </div>
                </div>
              ):(
                <div className="flex items-center justify-center text-muted-foreground">
                    Select a file to view it&apos;s contents;
                </div>
              )}  
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}