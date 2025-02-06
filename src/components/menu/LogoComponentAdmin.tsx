
import Link from "next/link";
import Image from "next/image";
import { getWebsiteinfo } from "@/lib/StaticDataHomePage";





const LogoComponentAdmin: React.FC =async () => {
 const company = await getWebsiteinfo();
      const companyData = JSON.parse(company);
  

  return (
    
      <div className="flex w-fit max-lg:w-[50%] gap-4 items-center justify-around">
        <Link href="/" aria-label="Home page " >    
          
       <Image src={companyData.logoUrl} alt={""} width={200} height={200}/>
           
        </Link>       
      </div>
  
  );
};

export default LogoComponentAdmin;
