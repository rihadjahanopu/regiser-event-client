"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function TagsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/categories");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Loader2 className="w-6 h-6 border-2 border-violet-600 animate-spin text-violet-400" />
    </div>
  );
}
