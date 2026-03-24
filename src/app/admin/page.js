"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import FooterInside from "../../../components/FooterInside";
import {
  Users,
  UserPlus,
  Film,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  TrendingUp,
  Activity,
  Menu,
  X,
  Trash2
} from "lucide-react";

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
      <div className="bg-neutral-900/90 backdrop-blur-md text-white p-3 rounded-xl shadow-2xl border border-white/10">
        <p className="font-bold mb-1 text-red-500">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-sm">
            <span className="opacity-70">{p.name}:</span> <span className="font-mono text-white">{p.value}</span>
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const removeUser = async (email, id) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      const res = await fetch("/api/admin/users/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, id }),
      });
      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Removal failed");
      else {
        setMessage(data.message);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during user removal");
    }
  };

  const removeMovie = async (id) => {
    if (!confirm("Are you sure you want to delete this movie?")) return;
    try {
      const res = await fetch("/api/admin/movies/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) setMessage(data.error || "Movie deletion failed");
      else {
        setMessage(data.message);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error during movie removal");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 font-medium animate-pulse">Synchronizing Admin Data...</p>
        </div>
      </div>
    );

  // Prepare chart data
  const userGrowthData = users.map((u, i) => ({
    name: `Entry ${i + 1}`,
    users: i + 1,
  }));

  const verifiedPieData = [
    { name: "Approved", value: users.filter((u) => u.isApproved).length },
    { name: "Pending", value: users.filter((u) => !u.isApproved).length },
  ];

  const movieYearData = movies.reduce((acc, m) => {
    const year = m.release_date?.split("-")[0] || "Unknown";
    const found = acc.find((a) => a.year === year);
    if (found) found.count += 1;
    else acc.push({ year, count: 1 });
    return acc;
  }, []).sort((a, b) => a.year.localeCompare(b.year));

  const COLORS = ["#ef4444", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white selection:bg-red-500/30 overflow-x-hidden">
      <Header />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-red-600 rounded-full shadow-2xl shadow-red-600/50 hover:scale-110 active:scale-95 transition-all"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Backdrop Overlay (Mobile) */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className={`
          w-72 bg-neutral-900/40 backdrop-blur-xl border-r border-white/5 p-8 flex flex-col fixed top-[90px] left-0 h-[calc(100vh-90px)] z-40 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2 text-neutral-300 hover:text-red-500 transition-all mb-12 mt-8 text-sm font-medium"
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Dashboard
          </Link>

          <div className="mb-10">
            <h1 className="text-xl font-black tracking-tighter uppercase mb-1">
              Admin <span className="text-red-600">Console</span>
            </h1>
            <div className="h-1 w-12 bg-red-600 rounded-full" />
          </div>

          <nav className="flex flex-col gap-2">
            {[
              { id: "allUsers", label: "Users Directory", icon: Users },
              { id: "pendingUsers", label: "Review Tasks", icon: UserPlus, count: pendingUsers.length },
              { id: "movies", label: "Catalog Manager", icon: Film },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group
                  ${activeTab === tab.id
                    ? "bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "text-neutral-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <tab.icon size={18} className={activeTab === tab.id ? "animate-pulse" : "opacity-70 group-hover:opacity-100"} />
                  <span className="font-semibold text-sm">{tab.label}</span>
                </div>
                {tab.count > 0 && (
                  <span className={`
                    text-[10px] px-2 py-0.5 rounded-full font-bold
                    ${activeTab === tab.id ? "bg-white text-red-600" : "bg-red-600 text-white"}
                  `}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 border-t border-white/5">
            <div className="bg-neutral-900/50 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-2">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold">Cloud Sync Active</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-72 px-4 sm:px-8 md:px-12 pb-12 pt-36 overflow-y-auto w-full max-w-[1600px] mx-auto min-h-screen">
          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              { label: "Total Community", value: users.length, icon: Users, color: "red", trend: "+12%" },
              { label: "Pending Approvals", value: pendingUsers.length, icon: UserPlus, color: "orange", trend: "Critical" },
              { label: "Catalog Size", value: movies.length, icon: Film, color: "blue", trend: "Healthy" }
            ].map((stat, idx) => (
              <div key={idx} className="group relative bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 overflow-hidden transition-all hover:border-white/10 hover:translate-y-[-4px]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-red-600/10 transition-colors" />

                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                    <h3 className="text-4xl font-black">{stat.value}</h3>
                  </div>
                  <div className={`p-4 rounded-2xl bg-${stat.color}-600/10 text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                    <stat.icon size={28} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 relative z-10">
                  <div className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    <Activity size={10} /> {stat.trend}
                  </div>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">Activity level</span>
                </div>
              </div>
            ))}
          </div>

          {message && (
            <div className="mb-8 p-4 bg-red-600 text-white font-bold text-center rounded-2xl shadow-xl shadow-red-600/20 animate-slideDown">
              {message}
            </div>
          )}

          {/* Dashboard View - Combined Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl transition-all hover:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <TrendingUp className="text-red-500" size={20} /> User Influx Trend
                </h3>
                <span className="text-xs text-neutral-500 font-mono">Last 30 Days</span>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowthData}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#ffffff05" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#ffffff30"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#888' }}
                  />
                  <YAxis
                    stroke="#ffffff30"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#888' }}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff10', strokeWidth: 1 }} />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#ef4444"
                    strokeWidth={4}
                    dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0, fill: '#fff' }}
                    animationDuration={2000}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 shadow-2xl transition-all hover:border-white/10">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <LayoutDashboard className="text-red-500" size={20} /> Distribution Overview
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={verifiedPieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={8}
                    animationDuration={2000}
                  >
                    {verifiedPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} cornerRadius={10} />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-bold text-neutral-400 uppercase tracking-tighter ml-2">{value}</span>}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section View */}
          <section className="bg-neutral-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-1 shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight mb-1">
                  {activeTab === "allUsers" ? "Registered Users" :
                    activeTab === "pendingUsers" ? "Verification Queue" : "Movie Library"}
                </h2>
                <p className="text-xs text-neutral-500 font-semibold uppercase tracking-widest">
                  Management Interface • Synchronized
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none opacity-40">
                    <Activity size={14} />
                  </div>
                  <input
                    type="text"
                    placeholder="Filter records..."
                    className="bg-black/40 border border-white/5 rounded-full py-2 pl-10 pr-6 text-xs focus:outline-none focus:border-red-500/50 transition-colors w-64"
                  />
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/[0.02]">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">Record Info</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500">
                      {activeTab === "movies" ? "Release Timeline" : "Identity Verified"}
                    </th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-neutral-500 text-right">Administrative Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {activeTab === "allUsers" && users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-red-400 flex items-center justify-center font-bold text-sm shadow-lg shadow-red-600/20">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.name}</p>
                            <p className="text-xs text-neutral-500 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        {u.isApproved ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase">
                            <CheckCircle2 size={12} /> Verified
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase">
                            <XCircle size={12} /> Pending
                          </div>
                        )}
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => removeUser(u.email, u._id)}
                          className="text-neutral-500 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-lg"
                          title="Remove User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "pendingUsers" && pendingUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-red-500/[0.02] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-sm border border-white/10">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{u.name}</p>
                            <p className="text-xs text-neutral-500 font-medium">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs text-amber-500 font-bold bg-amber-500/10 px-3 py-1 rounded-full">Requires Approval</span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            className="text-neutral-400 hover:text-white text-[10px] font-black uppercase tracking-tighter px-4 py-2 hover:bg-neutral-800 rounded-xl transition-all"
                            onClick={() => removeUser(u.email, u._id)}
                          >
                            Reject
                          </button>
                          <button
                            className="bg-red-600 text-white text-xs font-black uppercase tracking-tighter px-6 py-2.5 rounded-xl hover:bg-red-500 transition-all shadow-lg shadow-red-600/20 active:scale-95"
                            onClick={() => approveUser(u.email)}
                          >
                            Confirm Access
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {activeTab === "movies" && movies.map((m) => (
                    <tr key={m._id} className="hover:bg-white/[0.01] transition-colors group">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-16 rounded-lg bg-neutral-800 flex items-center justify-center overflow-hidden border border-white/10 group-hover:border-red-500/50 transition-colors">
                            <Film className="opacity-20" size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-sm group-hover:text-red-500 transition-colors">{m.name}</p>
                            <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-0.5">Media Asset</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-xs font-mono text-neutral-400">{m.release_date}</span>
                      </td>
                      <td className="p-6 text-right">
                        <button
                          onClick={() => removeMovie(m._id)}
                          className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white transition-all p-2.5 rounded-xl"
                          title="Delete Movie"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <FooterInside />
    </div>
  );
}
