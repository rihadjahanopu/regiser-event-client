"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TagsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/categories");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
