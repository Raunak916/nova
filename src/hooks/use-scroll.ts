import { useEffect, useState } from "react";

export const useScroll = ( thresold = 10 )=>{
    const[isScrolled , setIsScrolled] = useState(false);

    useEffect(()=> {
        const handleScroll = ()=>{
            setIsScrolled(window.scrollY > thresold)
        }

        window.addEventListener("scroll" , handleScroll)

        //for instant check in page load before scroll 
        handleScroll();

        return ()=> window.removeEventListener("scroll", handleScroll)
    }, [thresold])

    return isScrolled
}