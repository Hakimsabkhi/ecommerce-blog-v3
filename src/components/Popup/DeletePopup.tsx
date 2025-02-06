import React, { useEffect, useState } from 'react';
interface PopupProps {
    handleClosePopup: () => void;
    Delete:( id:string)=>void;
    id:string;
    name:string;
  }
  
const Popup: React.FC <PopupProps>= ({handleClosePopup,Delete,id,name}) => {
    const [isButtonVisible, setIsButtonVisible] = useState(true);
    const [inputValue, setInputValue] = useState('');
    const [buttonColor, setButtonColor] = useState('bg-primary');
    const isDeleteConfirmed = inputValue.toUpperCase() ;

    useEffect(() => {
        if (isDeleteConfirmed === 'DELETE') {
          setIsButtonVisible(false);
          setButtonColor('bg-primary');
        } else {
          setIsButtonVisible(true);
         setButtonColor('bg-primary');
        }
      }, [isDeleteConfirmed]);

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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 -m-1 flex items-center text-primary mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
               
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 flex items-center text-primary mx-auto"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h2 className="text-xl font-bold py-4">Are you sure?</h2>
            <p className="text-sm text-gray-500 px-8">
              Do you really want to delete your  {name}? <br/> 
              For confirmation input  <span className="text-red-500 font-bold">DELETE</span>:
            </p>
            <input 
             value={inputValue}
             onChange={(e) => setInputValue(e.target.value)}
            className="border-2 border-gray-400 rounded p-2 text-red-500 font-bold text-center uppercase"/>

          </div>
          {/* footer */}
          <div className="p-3 mt-2 text-center space-x-4 md:block">
            <button
            onClick={handleClosePopup}
             className="mb-2 md:mb-0 bg-white px-5 py-2 text-sm shadow-sm font-medium tracking-wider border text-primary rounded-full hover:shadow-lg hover:bg-[#15335D] hover:border-[#15335D] hover:text-white">
              Cancel
            </button>
           <button 
            onClick={() => Delete(id)}
            disabled={isButtonVisible}
              className={`mb-2 md:mb-0 px-5 py-2 text-sm shadow-sm font-medium tracking-wider rounded-full ${
                isButtonVisible
                  ? 'bg-gray-300 border-gray-300 text-gray-600 cursor-not-allowed'
                  : buttonColor + ' border border-primary text-white hover:bg-[#15335D] hover:border-[#15335D]'
              }`}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup;
