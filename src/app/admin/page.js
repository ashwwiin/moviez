"use client";

import { useEffect, useState } from "react";
import Header from "../../../components/Header";
import FooterInside from "../../../components/FooterInside";

import { FaUsers, FaUserCheck, FaFilm } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";

// Custom tooltip component for dark theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded shadow-lg border border-gray-700">
        <p className="font-semibold">{label}</p>
        {payload.map((p) => (
          <p key={p.name}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("allUsers");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, pendingRes, moviesRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/pending-users"),
        fetch("/api/admin/movies"),
      ]);

      const usersData = await usersRes.json();
      const pendingData = await pendingRes.json();
      const moviesData = await moviesRes.json();

      setUsers(usersData.users || []);
      setPendingUsers(pendingData.users || []);
      setMovies(moviesData.movies || []);
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (email) => {
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
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading admin data...
      </div>
    );

  // Prepare chart data
  const userGrowthData = users.map((u, i) => ({
    name: `Day ${i + 1}`,
    users: i + 1,
  }));

  const verifiedPieData = [
    { name: "Verified", value: users.filter((u) => u.emailVerified).length },
    { name: "Unverified", value: users.filter((u) => !u.emailVerified).length },
  ];

  const pendingBarData = [{ name: "Pending Users", count: pendingUsers.length }];

  const movieYearData = movies.reduce((acc, m) => {
    const year = m.release_date?.split("-")[0] || "Unknown";
    const found = acc.find((a) => a.year === year);
    if (found) found.count += 1;
    else acc.push({ year, count: 1 });
    return acc;
  }, []);

  const COLORS = ["#4ade80", "#f87171", "#facc15", "#60a5fa", "#f472b6"];

  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <Header />

      <div className="flex flex-1 pt-20">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col space-y-4">
          <h1 className="text-3xl font-bold mb-4 text-center">Admin Panel</h1>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition ${
              activeTab === "allUsers" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("allUsers")}
          >
            <FaUsers /> All Users
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition ${
              activeTab === "pendingUsers" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("pendingUsers")}
          >
            <FaUserCheck /> Pending Users
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-800 transition ${
              activeTab === "movies" ? "bg-gray-800" : ""
            }`}
            onClick={() => setActiveTab("movies")}
          >
            <FaFilm /> Movies
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center">
              <FaUsers className="text-4xl text-green-400 mb-2" />
              <h3 className="text-lg font-semibold">Total Users</h3>
              <p className="text-2xl font-bold">{users.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center">
              <FaUserCheck className="text-4xl text-yellow-400 mb-2" />
              <h3 className="text-lg font-semibold">Pending Users</h3>
              <p className="text-2xl font-bold">{pendingUsers.length}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg flex flex-col items-center">
              <FaFilm className="text-4xl text-red-400 mb-2" />
              <h3 className="text-lg font-semibold">Total Movies</h3>
              <p className="text-2xl font-bold">{movies.length}</p>
            </div>
          </div>

          {message && (
            <div className="mb-6 p-4 bg-gray-700 text-center rounded">{message}</div>
          )}

          {/* Charts */}
          {activeTab === "allUsers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#82ca9d"
                      strokeWidth={3}
                      activeDot={{ r: 8 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Verified vs Unverified Users</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={verifiedPieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={1500}
                    >
                      {verifiedPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "pendingUsers" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Pending Users Count</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={pendingBarData}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#facc15" animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === "movies" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-900 rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Movies Released Per Year</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={movieYearData}>
                    <CartesianGrid stroke="#333" strokeDasharray="3 3" />
                    <XAxis dataKey="year" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill="#60a5fa" animationDuration={1500} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Tables */}
           {activeTab === "allUsers" && (
            <div className="bg-gray-900 rounded shadow p-6 overflow-x-auto">
              <h2 className="text-2xl font-semibold mb-4">All Users</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 p-3">Name</th>
                    <th className="border-b border-gray-700 p-3">Email</th>
                    <th className="border-b border-gray-700 p-3">Verified</th>
                    <th className="border-b border-gray-700 p-3">Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-800">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.emailVerified ? "✅" : "❌"}</td>
                      <td className="p-3">{u.isApproved ? "✅" : "❌"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "pendingUsers" && (
            <div className="bg-gray-900 rounded shadow p-6 overflow-x-auto">
              <h2 className="text-2xl font-semibold mb-4">Pending Users</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 p-3">Name</th>
                    <th className="border-b border-gray-700 p-3">Email</th>
                    <th className="border-b border-gray-700 p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-800">
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">
                        <button
                          className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 transition"
                          onClick={() => approveUser(u.email)}
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "movies" && (
            <div className="bg-gray-900 rounded shadow p-6 overflow-x-auto">
              <h2 className="text-2xl font-semibold mb-4">Movies</h2>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-gray-700 p-3">Name</th>
                    <th className="border-b border-gray-700 p-3">Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m._id} className="hover:bg-gray-800">
                      <td className="p-3">{m.name}</td>
                      <td className="p-3">{m.release_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* You can reuse your tables from previous code below if needed */}
        </main>
      </div>

      <FooterInside />
    </div>
  );
}
