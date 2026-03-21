import { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Trash2, UserPlus } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await axios.get("/api/v1/users/profile"); 
      console.log(res);

      setUsers(res.data?.data || []); // adjust based on your ApiResponse wrapper
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/api/v1/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40 text-gray-500">
          <Loader className="animate-spin" size={32} />
        </div>
      ) : (
        <>
          <div className="mb-4 flex justify-between items-center">
            <button
              className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              onClick={() => alert("Add user functionality not implemented")}
            >
              <UserPlus className="mr-2" size={18} /> Add User
            </button>
          </div>

          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 border-b">Name</th>
                  <th className="px-4 py-2 border-b">Email</th>
                  <th className="px-4 py-2 border-b">Role</th>
                  <th className="px-4 py-2 border-b">Created</th>
                  <th className="px-4 py-2 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{user.name}</td>
                    <td className="px-4 py-2 border-b">{user.email}</td>
                    <td className="px-4 py-2 border-b">{user.role}</td>
                    <td className="px-4 py-2 border-b">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 border-b">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteUser(user._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}