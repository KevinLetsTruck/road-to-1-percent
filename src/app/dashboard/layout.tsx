"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ShieldCheck } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      const { data: adminProfile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      setIsAdmin(adminProfile?.is_admin || false);
    };

    checkAdminStatus();
  }, [user, supabase]);

  return (
    <>
      {/* Admin Button - Fixed at bottom-right to avoid header conflicts */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-purple-700 hover:to-purple-800 transition-all hover:shadow-lg flex items-center gap-2 shadow-xl"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Dashboard
          </button>
        </div>
      )}
      {children}
    </>
  );
}
