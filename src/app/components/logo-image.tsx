import Image from "next/image"

interface Props{
    size:number;
}
const LogoImage = ({ size }:Props)=>{
    return(
        <>
          <Image src="/nova-darkLogo.svg"
          alt="Nova Logo dark"
          height={size}
          width={size}
          className="hidden  dark:block"
          />
          
          
          <Image 
            src="/nova-lightLogo.svg" 
            className="block dark:hidden"
            alt="Nova Logo light"
            height={size}
            width={size}
            />
        </>
    )
}

export default LogoImage