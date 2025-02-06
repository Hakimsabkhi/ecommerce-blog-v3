"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { LuCircleX, LuSquareCheckBig } from "react-icons/lu";

const VerifyEmail = () => {


  const [loading, setLoading] = React.useState(false);
  const [verified, setVerified] = React.useState(false);
  const [error, setError] = React.useState(false);
  const route=useRouter()
  const searchParams = useSearchParams();
  const verifyToken = searchParams.get("verifyToken");
  const id = searchParams.get("id");

  const initialized = React.useRef(false);


  const verifyEmail = useCallback(async () => {
    if (!verifyToken || !id) return console.log("Invalid URL");
  
    setLoading(true);
  
    try {
      const res = await fetch(
        `/api/verifyemail?verifyToken=${verifyToken}&id=${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      if (res.ok) {
        setLoading(false);
        setVerified(true);
      }
  
      setTimeout(() => {
        route.push("/"); // Redirect to home page
      }, 30000); // 30 seconds
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  }, [verifyToken, id,route]); 

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      verifyEmail();
    }
  }, [verifyEmail]);
  if (loading)
    return (
      <h1 className="flex justify-center items-center h-screen">
        Verifying your Email address. Please wait...
      </h1>
    );

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-md">
        {verified && (
          <div  className="mb-5">
            <LuSquareCheckBig color="green" />
            <div>Email Verified!</div>
            <div>
              Your email has been verified successfully.
            </div>
          </div>
        )}

        {error && (
          <div  className="mb-5">
            <LuCircleX color="red" />
            <div>Email Verified Failed!</div>
            <div>
              Your verification token is invalid or Expired.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;