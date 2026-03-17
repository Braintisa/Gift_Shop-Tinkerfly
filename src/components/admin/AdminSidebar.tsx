import { LayoutDashboard, FolderOpen, Package, MessageSquare, Images, Settings, LogOut, Home, ShieldCheck } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Categories", url: "/admin/categories", icon: FolderOpen },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Social Gallery", url: "/admin/social-gallery", icon: Images },
  { title: "Admin Emails", url: "/admin/admin-emails", icon: ShieldCheck },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
];

interface Props {
  user: User | null;
  onSignOut: () => void;
}

export function AdminSidebar({ user, onSignOut }: Props) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3 space-y-2">
        {!collapsed && user && (
          <p className="text-xs text-muted-foreground truncate px-2">{user.email}</p>
        )}
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="flex-1 justify-start" asChild>
            <a href="/" target="_blank"><Home className="h-4 w-4 mr-2" />{!collapsed && "View Site"}</a>
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:text-destructive" onClick={onSignOut}>
          <LogOut className="h-4 w-4 mr-2" />{!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
