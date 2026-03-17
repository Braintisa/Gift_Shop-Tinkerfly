import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Mail, ShieldCheck, Eye, EyeOff, KeyRound, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function AdminEmailsManager() {
  const [newEmail, setNewEmail] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [editingKeyword, setEditingKeyword] = useState<Record<string, string>>({});
  const [visibleKeywords, setVisibleKeywords] = useState<Record<string, boolean>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: emails = [], isLoading } = useQuery({
    queryKey: ["admin-emails"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_emails")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const addEmail = useMutation({
    mutationFn: async ({ email, keyword }: { email: string; keyword: string }) => {
      const { error } = await supabase
        .from("admin_emails")
        .insert({ email: email.toLowerCase().trim(), recovery_keyword: keyword || null });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails"] });
      setNewEmail("");
      setNewKeyword("");
      toast({ title: "Email added", description: "Admin account has been added." });
    },
    onError: (err: any) => {
      const msg = err.message?.includes("duplicate")
        ? "This email is already in the list."
        : "Failed to add email.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase
        .from("admin_emails")
        .update({ active })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails"] });
    },
  });

  const updateKeyword = useMutation({
    mutationFn: async ({ id, keyword }: { id: string; keyword: string }) => {
      const { error } = await supabase
        .from("admin_emails")
        .update({ recovery_keyword: keyword || null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails"] });
      setEditingKeyword((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast({ title: "Updated", description: "Recovery keyword updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update keyword.", variant: "destructive" });
    },
  });

  const removeEmail = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("admin_emails")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-emails"] });
      toast({ title: "Removed", description: "Admin account removed." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to remove email.", variant: "destructive" });
    },
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newEmail.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Invalid email", description: "Please enter a valid email.", variant: "destructive" });
      return;
    }
    addEmail.mutate({ email: trimmed, keyword: newKeyword.trim() });
  };

  const toggleKeywordVisibility = (id: string) => {
    setVisibleKeywords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startEditingKeyword = (id: string, currentKeyword: string | null) => {
    setEditingKeyword((prev) => ({ ...prev, [id]: currentKeyword || "" }));
  };

  const cancelEditingKeyword = (id: string) => {
    setEditingKeyword((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-display font-semibold flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          Admin Accounts
        </h2>
        <p className="text-muted-foreground mt-1">
          Manage approved admin accounts. Only these emails can log in or recover passwords.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Add Admin Account</CardTitle>
          <CardDescription>Add an email with an optional recovery keyword for password recovery.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAdd} className="space-y-3">
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
                type="text"
                placeholder="Recovery keyword (optional)"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={addEmail.isPending} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              ⚠️ Save the recovery keyword securely. It's used for password recovery without email.
            </p>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Admin Accounts</CardTitle>
          <CardDescription>{emails.length} account(s) configured</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : emails.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              No admin accounts configured yet. Add one above.
            </p>
          ) : (
            <div className="space-y-4">
              {emails.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-lg border bg-muted/30 space-y-3"
                >
                  {/* Row 1: Email + status + toggle + delete */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium truncate">{item.email}</span>
                      <Badge variant={item.active ? "default" : "secondary"} className="shrink-0">
                        {item.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Switch
                        checked={item.active}
                        onCheckedChange={(checked) =>
                          toggleActive.mutate({ id: item.id, active: checked })
                        }
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeEmail.mutate(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: Recovery keyword */}
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-muted-foreground shrink-0" />
                    {editingKeyword[item.id] !== undefined ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="text"
                          value={editingKeyword[item.id]}
                          onChange={(e) =>
                            setEditingKeyword((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          placeholder="Enter recovery keyword"
                          className="flex-1 h-8 text-sm"
                        />
                        <Button
                          size="sm"
                          variant="default"
                          className="h-8 gap-1"
                          onClick={() =>
                            updateKeyword.mutate({ id: item.id, keyword: editingKeyword[item.id] })
                          }
                          disabled={updateKeyword.isPending}
                        >
                          <Save className="h-3 w-3" />
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8"
                          onClick={() => cancelEditingKeyword(item.id)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-sm text-muted-foreground">
                          {item.recovery_keyword
                            ? visibleKeywords[item.id]
                              ? item.recovery_keyword
                              : "••••••••"
                            : "Not set"}
                        </span>
                        {item.recovery_keyword && (
                          <button
                            type="button"
                            onClick={() => toggleKeywordVisibility(item.id)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {visibleKeywords[item.id] ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs ml-auto"
                          onClick={() => startEditingKeyword(item.id, item.recovery_keyword)}
                        >
                          {item.recovery_keyword ? "Change" : "Set Keyword"}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
