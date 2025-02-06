import NavAdmin from "@/components/NavAdmin";
import HeaderAdmin from "@/components/menu/HeaderAdmin";
import "@/app/globals.css";
import { ToastContainer } from "react-toastify";


const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ToastContainer
              position="top-center"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
      <HeaderAdmin />
      <NavAdmin />
      {children}
    </>
  );
};

export default AdminLayout;
