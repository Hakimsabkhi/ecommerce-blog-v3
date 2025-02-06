
import "@/app/globals.css";
import Footer from "@/components/menu/Footer";
import Header from "@/components/menu/Header";
import StoreProviders from "@/components/ProviderComp/StoreProvider";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div >
      <StoreProviders>
        <Header />
        {children}
        <Footer />
      </StoreProviders>
    </div>
  );
};

export default SubLayout;
