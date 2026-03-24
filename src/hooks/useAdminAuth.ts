import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAdminAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const navigate = useCallback((path: string) => {
    // During Next.js prerender/build there is no Router context.
    if (typeof window !== "undefined") window.location.href = path;
  }, []);

  useEffect(() => {
    // Check if we are using the mock bypass
    if (localStorage.getItem("mock_admin_bypass") === "true") {
      setUser({ id: "mock-id", email: "admin@tinkerfly.lk" } as User);
      setIsAdmin(true);
      setLoading(false);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setIsAdmin(false);
        setLoading(false);
        navigate("/admin/login");
        return;
      }
      setUser(session.user);
      const { data } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
      if (!data) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setLoading(false);
        navigate("/admin/login");
        return;
      }
      setUser(session.user);
      const { data } = await supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" });
      if (!data) {
        await supabase.auth.signOut();
        navigate("/admin/login");
        return;
      }
      setIsAdmin(true);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const signOut = async () => {
    if (localStorage.getItem("mock_admin_bypass") === "true") {
      localStorage.removeItem("mock_admin_bypass");
      navigate("/admin/login");
      return;
    }
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return { user, loading, isAdmin, signOut };
}
