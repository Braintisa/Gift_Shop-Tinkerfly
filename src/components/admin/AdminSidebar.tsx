import {
  LayoutDashboard,
  FolderOpen,
  Package,
  MessageSquare,
  Images,
  Settings,
  LogOut,
  Home,
  ShieldCheck,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarFooter, SidebarRail, useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";

const navItems = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Categories", url: "/admin/categories", icon: FolderOpen },
  { title: "Products", url: "/admin/products", icon: Package },
  { title: "Testimonials", url: "/admin/testimonials", icon: MessageSquare },
  { title: "Social Gallery", url: "/admin/social-gallery", icon: Images },
  { title: "Admin Users", url: "/admin/admin-users", icon: ShieldCheck },
  { title: "Site Settings", url: "/admin/settings", icon: Settings },
];

interface Props {
  user: User | null;
  onSignOut: () => void;
}

export function AdminSidebar({ user, onSignOut }: Props) {
  const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed";
  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                      onClick={closeMobileSidebar}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
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
          <Button variant="ghost" size="sm" className={collapsed ? "w-full justify-center px-2" : "flex-1 justify-start"} asChild>
            <a href="/" target="_blank" rel="noreferrer">
              <Home className={collapsed ? "h-4 w-4" : "h-4 w-4 mr-2"} />
              {!collapsed && "View Site"}
            </a>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className={collapsed ? "w-full justify-center px-2" : "w-full justify-start"}
          onClick={toggleSidebar}
        >
          {collapsed ? <PanelLeftOpen className={collapsed ? "h-4 w-4" : "h-4 w-4 mr-2"} /> : <PanelLeftClose className="h-4 w-4 mr-2" />}
          {!collapsed && (collapsed ? "Expand Sidebar" : "Collapse Sidebar")}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={collapsed ? "w-full justify-center px-2 text-destructive hover:text-destructive" : "w-full justify-start text-destructive hover:text-destructive"}
          onClick={onSignOut}
        >
          <LogOut className={collapsed ? "h-4 w-4" : "h-4 w-4 mr-2"} />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
