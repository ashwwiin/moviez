"use client";
import { useEffect, useState } from "react";

export default function AdminApproval() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch users pending approval
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending-users");
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setMessage("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Approve a user
  const approveUser = async (email) => {
    setMessage("");
    try {
      const res = await fetch("/api/admin/approve-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) setMessage(data.error || "Approval failed");
      else {
        setMessage(data.message);
        fetchUsers(); // refresh the list after approval
      }
    } catch (err) {
      console.error("Approval error:", err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Pending Users Approval</h1>

      {loading ? (
        <p className="text-center">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-400">No users pending approval</p>
      ) : (
        <ul className="space-y-3 max-w-xl mx-auto">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex justify-between items-center bg-gray-900 p-4 rounded-lg shadow-md"
            >
              <span className="font-medium">
                {user.name} <span className="text-gray-400">({user.email})</span>
              </span>
              <button
                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
                onClick={() => approveUser(user.email)}
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}

      {message && (
        <p className="mt-6 text-center text-yellow-400 font-semibold">{message}</p>
      )}
    </div>
  );
}
