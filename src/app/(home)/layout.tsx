
import { Navbar } from "@/modules/home/ui/components/navbar";
interface Props{
    children:React.ReactNode
}

const Layout = ({ children }:Props)=>{

    return(
        <main className={`flex flex-col min-h-screen relative overflow-x-hidden `}>
          
             <Navbar />
            {/* Page content */}
            <div className="flex-1 flex flex-col px-4 pb-4 relative z-10">
                {children}
            </div>
        </main>
    )
}
  
export default Layout;