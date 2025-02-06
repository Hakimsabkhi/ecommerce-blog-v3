
import "@/app/globals.css";
import StoreProviders from "@/components/ProviderComp/StoreProvider";


const SubLayout = ({ children }: { children: React.ReactNode }) => {
  return (
      <StoreProviders>
        {children}
      </StoreProviders>
  );
};

export default SubLayout;
