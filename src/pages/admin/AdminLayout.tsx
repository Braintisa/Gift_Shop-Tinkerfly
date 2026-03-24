import { Outlet } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminLayout() {
  const { user, loading, signOut } = useAdminAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen>
      <AdminSidebar user={user} onSignOut={signOut} />
      <SidebarInset>
        <header className="h-14 flex items-center border-b bg-background px-4 gap-4 shrink-0">
          <SidebarTrigger />
          <h1 className="font-display text-lg font-semibold truncate">Tinkerfly Admin</h1>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6 bg-muted/30">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
