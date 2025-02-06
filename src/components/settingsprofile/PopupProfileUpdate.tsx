import React, { useState } from "react";
import { toast } from "react-toastify";
interface PopupProfileUpdateParam {
  close(): void;
  selectupdate:string;
  fetchProfile():void;
}


const PopupProfileUpdate: React.FC<PopupProfileUpdateParam> = ({ close,selectupdate,fetchProfile}) => {
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [replyPassword, setReplyPassword] = useState('');

  const update = async () => {
    let payload;

    if (selectupdate === "phone") {
      payload = { phone };
    } else if (selectupdate === "password") {
      payload = { currentPassword, newPassword, replyPassword };
    }

    try {
      const response = await fetch(`api/users/updateuser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

   
      if (!response.ok) {
        // Handle different status codes in the same block
        if (response.status === 400) {
          toast.error('Invalid input');
        } else if (response.status === 401) {
          toast.error('Unauthorized');
        } else if (response.status === 404) {
          toast.error('User not found');
        } else if (response.status === 406) {
          toast.error('No existing password to compare');
        } else if (response.status === 402) {
          toast.error('Current password is incorrect');
        } else if (response.status === 403) {
          toast.error('Passwords do not match');
        } else if (response.status === 500) {
          toast.error('Server error. Please try again later');
        } else {
          throw new Error('Unexpected error occurred');
        }
        return; // Exit if there's an error
      }
  

      if (response.status === 200) {
        toast.success('User updated successfully!');
        fetchProfile();
        close();
      }
    } catch (error) {
      console.error('Error during update:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-w-screen h-screen animated fadeIn faster fixed left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover backdrop-filter backdrop-brightness-75">
      <div className="absolute opacity-80 inset-0 z-0"></div>
      <div className="w-full max-w-lg p-5 relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        {selectupdate === "phone" && (
          <div className="mb-4">
            <p className="font-bold">Phone Number</p>
            <div className="gap-2 grid grid-cols-1">
              <p className="text-sm text-gray-600">Phone</p>
              <input
                name="phone"
                type="tel"
                minLength={8}
                maxLength={8}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </div>
          </div>
        )}
        {selectupdate === "password" && (
          <div className="mb-4">
            <p className="font-bold">Password</p>
            <div className="gap-2 grid grid-cols-1">
              <p className="text-sm text-gray-600">Actual Password</p>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
              <p className="text-sm text-gray-600">New Password</p>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
              <p className="text-sm text-gray-600">Repeat Password</p>
              <input
                type="password"
                value={replyPassword}
                onChange={(e) => setReplyPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={update} // Call the update function on click
            className="text-indigo-600 text-sm font-semibold hover:underline"
          >
            Update
          </button>
          <button
            type="button"
            onClick={close}
            className="text-indigo-600 text-sm font-semibold hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};


export default PopupProfileUpdate;
