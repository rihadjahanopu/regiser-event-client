"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";

export default function UnauthorizedPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-[#07070f] flex items-center justify-center p-6 text-white relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-900/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-violet-900/10 rounded-full blur-3xl" />

      <div className="relative z-10 text-center max-w-md w-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-2xl rounded-3xl p-8 shadow-2xl">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6 text-red-500 animate-pulse">
          <ShieldAlert className="w-10 h-10" />
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight mb-3">403 Forbidden</h1>
        <p className="text-slate-400 text-base leading-relaxed mb-6">
          Access denied. You do not have permission to view this resource. Please sign in with an account that has admin privileges.
        </p>

        {session?.user && (
          <div className="mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-left">
            <p className="text-xs text-slate-400 font-semibold mb-1">Currently logged in as:</p>
            <p className="text-sm font-bold text-white">{session.user.name} ({session.user.email})</p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link href="/admin/login">
            <Button className="w-full h-11 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/25 transition-all">
              <ArrowLeft className="w-4 h-4" />
              Sign in with Admin Account
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full h-11 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center gap-2 transition-all">
              <Home className="w-4 h-4" />
              Go Back Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
