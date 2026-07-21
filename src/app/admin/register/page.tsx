"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Mail, Loader2, ArrowRight, UserPlus, User, Shield } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import axios from "axios";

export default function AdminRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("/api/admin/register", { name, email, password });
      if (response.data.success) {
        toast.success("Admin registered successfully!");
        router.push("/admin/login");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to register admin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Panel - Hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-blue-900 relative overflow-hidden items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute top-[30%] left-[20%] w-64 h-64 bg-teal-400/20 rounded-full blur-3xl" />

        <div className="relative z-10 p-12 text-white max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-lg mb-8 border border-white/20">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-6 leading-tight">
              Join the administration team.
            </h1>
            <p className="text-blue-100 text-lg leading-relaxed mb-8">
              Create an account to gain access to the secure admin dashboard. Manage participants, view real-time data, and configure system settings.
            </p>
            
            <div className="flex items-center space-x-4 text-sm font-medium text-blue-200">
              <div className="flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Role-Based Access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10 lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h2>
            <p className="text-slate-500">Register as a new administrator</p>
          </div>

          <Card className="border-0 shadow-2xl shadow-blue-900/5 bg-white dark:bg-slate-900 overflow-hidden">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Full Name</Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      id="name" 
                      type="text" 
                      placeholder="Super Admin"
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="admin@example.com"
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                    <Input 
                      id="password" 
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 h-12 bg-slate-50 dark:bg-slate-950 border-slate-200 focus-visible:ring-blue-600 focus-visible:border-blue-600"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5 group dark:bg-blue-600 dark:hover:bg-blue-700" 
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <span className="flex items-center font-semibold text-base">
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center text-slate-500">
            Already have an account?{" "}
            <Link href="/admin/login" className="font-semibold text-slate-900 dark:text-blue-400 hover:underline transition-colors">
              Sign in instead
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

