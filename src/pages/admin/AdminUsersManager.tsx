"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, KeyRound, ShieldCheck, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type AdminUser = {
  id: string;
  email: string;
  created_at: string | null;
};

const dashboardQueryClient = new QueryClient();

function AdminUsersManagerInner() {
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [editingPasswords, setEditingPasswords] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/admin-users");
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to load admin users");
      }
      return (await res.json()) as AdminUser[];
    },
  });

  const addUser = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const res = await fetch("/api/admin/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add admin user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setNewEmail("");
      setNewPassword("");
      toast({ title: "Admin user added", description: "Credentials stored successfully." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message || "Failed to add admin user.",
        variant: "destructive",
      });
    },
  });

  const deleteUser = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/admin-users/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete admin user");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Admin user removed", description: "Account deleted successfully." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message || "Failed to delete admin user.",
        variant: "destructive",
      });
    },
  });

  const updatePassword = useMutation({
    mutationFn: async ({ id, password }: { id: string; password: string }) => {
      const res = await fetch(`/api/admin/admin-users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update password");
      }
    },
    onSuccess: (_, { id }) => {
      setEditingPasswords((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Password updated", description: "Admin password changed successfully." });
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err?.message || "Failed to update password.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Admin Users
        </h2>
        <p className="text-muted-foreground mt-1">Manage admin login credentials stored in MySQL.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Admin User</CardTitle>
          <CardDescription>Create a new admin email + password.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              const email = newEmail.trim().toLowerCase();
              const password = newPassword;
              if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                toast({ title: "Invalid email", description: "Enter a valid email.", variant: "destructive" });
                return;
              }
              if (!password || password.length < 6) {
                toast({ title: "Password too short", description: "Use at least 6 characters.", variant: "destructive" });
                return;
              }
              addUser.mutate({ email, password });
            }}
          >
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="admin@tinkerfly.lk"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={addUser.isPending} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Existing Admin Users</CardTitle>
          <CardDescription>{users.length} account(s) configured</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : users.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">No admin users configured yet.</p>
          ) : (
            <div className="space-y-4">
              {users.map((u) => {
                const editing = editingPasswords[u.id] !== undefined;
                return (
                  <div key={u.id} className="p-4 rounded-lg border bg-muted/30 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium truncate">{u.email}</span>
                          <Badge variant="default" className="shrink-0">
                            Active
                          </Badge>
                        </div>
                        {u.created_at ? (
                          <p className="text-xs text-muted-foreground mt-1">
                            Created: {new Date(u.created_at).toLocaleString()}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            setEditingPasswords((prev) => ({ ...prev, [u.id]: "" }))
                          }
                          disabled={editing}
                        >
                          <KeyRound className="h-4 w-4" />
                          Change Password
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => deleteUser.mutate(u.id)}
                          disabled={deleteUser.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    {editing ? (
                      <div className="space-y-2">
                        <Input
                          type="password"
                          value={editingPasswords[u.id] ?? ""}
                          placeholder="New password"
                          onChange={(e) =>
                            setEditingPasswords((prev) => ({ ...prev, [u.id]: e.target.value }))
                          }
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="gap-1"
                            onClick={() => {
                              const password = (editingPasswords[u.id] ?? "").trim();
                              if (!password || password.length < 6) {
                                toast({
                                  title: "Password too short",
                                  description: "Use at least 6 characters.",
                                  variant: "destructive",
                                });
                                return;
                              }
                              updatePassword.mutate({ id: u.id, password });
                            }}
                            disabled={updatePassword.isPending}
                          >
                            <Save className="h-3.5 w-3.5" />
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingPasswords((prev) => {
                                const next = { ...prev };
                                delete next[u.id];
                                return next;
                              })
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminUsersManager() {
  // Ensure Next.js prerendering/build doesn't crash due to missing QueryClientProvider.
  return (
    <QueryClientProvider client={dashboardQueryClient}>
      <AdminUsersManagerInner />
    </QueryClientProvider>
  );
}

