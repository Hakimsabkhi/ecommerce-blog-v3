
import "@/app/globals.css";
import Footer from "@/components/menu/Footer";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  
  return (
    <>
        {children}
        <Footer />
    </>
  );
};

export default SubLayout;
