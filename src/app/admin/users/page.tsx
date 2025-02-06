"use client";
import { FaSpinner, FaTrashAlt } from "react-icons/fa";
import { useEffect, useMemo, useState, useCallback } from "react";
import DeletePopup from "@/components/Popup/DeletePopup";
import { toast } from "react-toastify";
import Pagination from "@/components/Pagination";
import useIs2xl from "@/hooks/useIs2x";
import { useSession } from "next-auth/react";

interface User {
  _id: string;
  email: string;
  role: string;
}
interface Role {
  _id: string;
  name: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState({ id: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const {data:session}=useSession();
  const is2xl = useIs2xl();
  const usersPerPage = is2xl ? 7 : 5;


  const totalPages = useMemo(() => {
    return Math.ceil(users.length / usersPerPage);
  }, [users.length, usersPerPage]);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`/api/users/userdashboard`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await res.json();
      setUsers(data);
    } catch (error: unknown) {
      // Handle different error types effectively
      if (error instanceof Error) {
        console.error("Error deleting category:", error.message);
      } else if (typeof error === "string") {
        console.error("String error:", error);
      } else {
        console.error("Unknown error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await fetch(`/api/role/getroles`);
      const data = await res.json();
      setRoles(data.roles);
    } catch (error) {
      console.error("Failed to fetch roles:", error);
    }
  };

  const filterUsers = useCallback(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(lowerCaseSearchTerm) &&
        (selectedRole === "" || user.role === selectedRole)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, users]);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleDeleteClick = (user: User) => {
    setLoadingUserId(user._id);
    setSelectedUser({ id: user._id, email: user.email });
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setLoadingUserId(null);
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/users/deleteuserbyid/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`Failed to delete user. Status: ${response.status}`);
      }
      fetchUsers();
      toast.success("User deleted successfully!");
      handleClosePopup();
    } catch (error) {
      console.error("Failed to delete user.",error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    setLoadingUserId(userId);
    try {
      const response = await fetch(`/api/users/updateuserrole/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update role");
      }
      fetchUsers();
    } catch (error) {
      console.error("Error changing role:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  const handleSearchRole = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value);
  };

  return (
    <div className="flex flex-col mx-auto w-[90%] gap-4">
    <div className="flex items-center h-[80px] ">
      <p className="text-3xl max-sm:text-sm font-bold">Admin Dashboard</p>
        
      </div>

      <div className="h-[50px] flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg max-w-max"
        />
        <select
          name="Role"
          value={selectedRole}
          onChange={handleSearchRole}
          className="bg-gray-50 p-2 border border-gray-300 rounded-lg w-[20%] "
        >
          <option value="">All</option>
    
          {roles.map((role, index) => (
          (session?.user?.role !== "SuperAdmin" && role.name !== "Admin") || session?.user?.role === "SuperAdmin" ? (   <option key={index} value={role.name}>
              {role.name}
            </option>):null
          ))}
        </select>
      </div>
      <div className="max-2xl:h-80 h-[50vh] max-md:hidden">
        <table className="w-full rounded overflow-hidden table-fixed">
          <thead>
            <tr className="bg-gray-800">
              <th className="pl-6 py-3 w-1/3 max-sm:w-1/2">Email</th>
              <th className=" py-3 w-1/3 max-sm:w-auto text-center">Role</th>
              <th className=" py-3 w-1/3 max-sm:w-auto text-center">Actions</th>
            </tr>
          </thead>
          {loading ? (
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="flex justify-center items-center h-full w-full py-6">
                    <FaSpinner className="animate-spin text-[30px]" />
                  </div>
                </td>
              </tr>
            </tbody>
          ) : filteredUsers.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={3}>
                  <div className="text-center py-6 text-gray-600 w-full">
                    <p>No users found.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className="sm:px-6 py-1 font-medium text-gray-900 dark:text-white truncate">
                    {user.email}
                  </td>
                  <td className=" py-1 text-center">
                    <select
                      className="sm:w-[50%] sm:text-center border-2 sm:p-2 py-2"
                      value={user.role}
                      onChange={(e) => handleChangeRole(user._id, e.target.value)}
                      disabled={loadingUserId === user._id}
                    >
                       
                      {roles.map((role, index) => (
                      (session?.user?.role !== "SuperAdmin" && role.name !== "Admin") || session?.user?.role === "SuperAdmin" ? (   <option key={index} value={role.name}>
                          {role.name}
                        </option>):null
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-1 text-center">
                    <button
                      onClick={() => handleDeleteClick(user)}
                      className="bg-gray-800 text-white w-10 h-10 pl-3 hover:bg-gray-600 rounded-md"
                      disabled={loadingUserId === user._id}
                    >
                      {loadingUserId === user._id ? "Processing..." : <FaTrashAlt />}
                    </button>
                    {isPopupOpen && (
                      <DeletePopup
                        handleClosePopup={handleClosePopup}
                        Delete={handleDeleteUser}
                        id={selectedUser.id}
                        name={selectedUser.email}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>

      <div className=" md:hidden">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="p-4 mb-4 bg-gray-100 rounded shadow-md"
          >
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <div className="flex justify-between mt-2">
              <select
              className="p-2"
                value={user.role}
                onChange={(e) => handleChangeRole(user._id, e.target.value)}
              >
                {roles.map((role) => (
                  <option key={role._id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
              
              <button
                      onClick={() => handleDeleteClick(user)}
                      className="bg-gray-800 text-white w-10 h-10 pl-3 hover:bg-gray-600 rounded-md"
                      disabled={loadingUserId === user._id}
                    >
                      {loadingUserId === user._id ? "Processing..." : <FaTrashAlt />}
                    </button>
                    {isPopupOpen && (
                      <DeletePopup
                        handleClosePopup={handleClosePopup}
                        Delete={handleDeleteUser}
                        id={selectedUser.id}
                        name={selectedUser.email}
                      />
                    )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
