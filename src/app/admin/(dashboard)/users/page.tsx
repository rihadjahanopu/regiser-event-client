"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Shield, 
  Trash2, 
  UserCheck, 
  UserMinus,
  RefreshCw,
  Mail,
  Calendar
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/users");
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await axios.put(`/api/admin/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success(`User role updated to ${newRole}`);
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user and all their sessions?")) return;
    try {
      const res = await axios.delete(`/api/admin/users/${userId}`);
      if (res.data.success) {
        toast.success("User account deleted successfully");
        setUsers(users.filter(u => u._id !== userId));
      }
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(search.toLowerCase()) || 
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">User Management</h1>
          <p className="text-slate-500 text-xs mt-0.5">Oversee registration roles, edit user credentials, and delete profiles.</p>
        </div>
        <button 
          onClick={fetchUsers}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="relative w-full sm:flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search users by name or email..."
            className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm placeholder-slate-400 text-slate-950 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 h-10 px-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Users Table */}
      <Card className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Joined Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-all">
                      <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-bold uppercase">
                          {user.name.charAt(0)}
                        </div>
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role || "user"}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-xs">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/45 transition-all"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500">
              No registered users found.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
