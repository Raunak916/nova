import LogoImage from '@/app/components/logo-image';
import { useState , useEffect } from 'react';

const ShimmerMessages = ()=>{
    const messages = [
        "Thinking...",
        "Loading...",
        "Generating...",
        "Analyzing your request...",
        "Building your response...",
        "Crafting components...",
        "Optimizing content...",
        "Adding Final Touches...",
        "Almost there...",
    ]
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
    useEffect(()=>{
        const interval = setInterval(()=>{
            setCurrentMessageIndex((prev)=> (prev + 1)% messages.length)
        },2000)
        return () => clearInterval(interval);
    },[])
    return (
        <div className='flex items-center gap-2'>
            <span className='text-base text-muted-foreground animate-pulse'>
                {messages[currentMessageIndex]}
            </span>
        </div>
    )
}

export const MessageLoading = ()=>{
    return(
        <div className='flex flex-col group px-2 pb-4'>
            <div className='flex items-center gap-2 pl-2 mb-2'>
                <LogoImage size={18} />
                <span className='text-sm font-medium'>NovaAI</span>
            </div>
            <div className='pl-8.5 flex flex-col gap-y-4'>
                <ShimmerMessages />
            </div>
        </div>
    )
}