import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions"; // Ensure the path is correct
import SessionProviderWrapper from "@/components/ProviderComp/SessionProviderWrapper";
import { Poppins } from "next/font/google";
import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";


// Load the Google font
const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"], // Include all weights
  style: ["normal", "italic"], // Include both normal and italic styles
  display: "swap", // Optional: Use font-display: swap for better performance
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);
  
  return (
    <html lang="en" className={`${poppins.className} w-full h-full`}>
      <head>
    <title>Your Page Title</title>
    
  </head>
      <body className="w-full h-full">
        <SessionProviderWrapper session={session}>    
            {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
};

export default RootLayout;
