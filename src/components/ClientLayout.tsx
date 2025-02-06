import React from "react";
import Footer from "@/components/menu/Footer";
import Header from "./menu/LogoComponent";
import Headertop from "./menu/Headertop";
import HeaderBottom from "./menu/Headerbottom";
import UserMenu from "@/components/userComp/UserMenu";
import { Session } from "next-auth";

interface ClientLayoutProps {
  session: Session | null;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ session }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Headertop />
      <UserMenu session={session} />
      <Header />
      <HeaderBottom />
      <Footer />
    </div>
  );
};

export default ClientLayout;
