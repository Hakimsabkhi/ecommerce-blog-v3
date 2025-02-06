// components/menu/Header.tsx

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";




import Notification from "@/components/menu/Notification";
import LogoComponentAdmin from "./LogoComponentAdmin";
import UserMenuadmin from "@/components/userComp/UserMenuadmin";

const HeaderAdmin = async () => {
  // Fetch the session on the server-side
  const session = await getServerSession(authOptions);

  return (
    <>
     
      <div className="w-full h-[80px]  flex justify-center items-center max-lg:justify-around gap-4 border-y border-gray-600
         max-sm:bg-slate-400 max-md:bg-cyan-800 max-lg:bg-violet-600  max-xl:bg-yellow-400 max-2xl:bg-green-400 bg-black  z-50">
        <div className="w-[90%] flex justify-between items-center max-lg:justify-around gap-4">
          <LogoComponentAdmin />
          <div className="flex">
        
           <Notification/>
            <UserMenuadmin session={session} />
          </div>
        </div>
      </div>
   
    </>
  );
};

export default HeaderAdmin;
