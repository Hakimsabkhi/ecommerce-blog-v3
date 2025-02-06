import React from 'react'
interface ConfirmPopupProps{
    handleClosePopupinvoice:()=>void;
    handleinvoiceconfirm:(orderId:string,newStatus:string)=>void;
    selectedorderid:string;
    selectedval:string;


}
const ConfirmPopup:React.FC <ConfirmPopupProps>= ({handleClosePopupinvoice,handleinvoiceconfirm,selectedorderid,selectedval})=> {
  return (
    <div
      className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75"      
    >
      <div className="absoluteopacity-80 inset-0 z-0 "></div>
      <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        {/* content */}
        <div>
          {/* body */}
          <div className="text-center p-5 flex-auto justify-center">
           
            <svg  className="w-20 h-20 -m-1 flex items-center text-primary mx-auto"
             viewBox="0 0 1024 1024" 
             
  version="1.1" xmlns="http://www.w3.org/2000/svg">
<path d="M511.64164 924.327835c-228.816869 0-414.989937-186.16283-414.989937-414.989937S282.825796 94.347961 511.64164 94.347961c102.396724 0 200.763434 37.621642 276.975315 105.931176 9.47913 8.499272 10.266498 23.077351 1.755963 32.556481-8.488009 9.501656-23.054826 10.266498-32.556481 1.778489-67.723871-60.721519-155.148319-94.156494-246.174797-94.156494-203.396868 0-368.880285 165.482394-368.880285 368.880285S308.243749 878.218184 511.64164 878.218184c199.164126 0 361.089542-155.779033 368.60998-354.639065 0.49556-12.720751 11.032364-22.863359 23.910794-22.177356 12.720751 0.484298 22.649367 11.190043 22.15483 23.910794-8.465484 223.74966-190.609564 399.015278-414.675604 399.015278z" fill="currentColor" /><path d="M960.926616 327.538868l-65.210232-65.209209-350.956149 350.956149-244.56832-244.566273-65.210233 65.209209 309.745789 309.743741 0.032764-0.031741 0.03174 0.031741z" fill="currentColor" />
</svg>
            <h2 className="text-xl font-bold py-4">Are you sure?</h2>
            <p className="text-sm text-gray-500 px-8">
              Do you really want to Invoice  go to Accounting :
              
            </p>
            

          </div>
          {/* footer */}
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
            onClick={handleClosePopupinvoice}
             className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-primary rounded-full hover:shadow-lg hover:bg-[#15335D] hover:border-[#15335D] hover:text-white">
              Cancel
            </button>
           <button 
           type="button"
           onClick={()=>handleinvoiceconfirm(selectedorderid,selectedval)}
           className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-primary rounded-full hover:shadow-lg hover:bg-[#15335D] hover:border-[#15335D] text-white"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmPopup