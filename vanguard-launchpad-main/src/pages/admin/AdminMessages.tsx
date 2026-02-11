import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, CheckCircle2, Mail, User, Building, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  fetchContactSubmissions,
  markContactAsRead,
  deleteContactSubmission,
} from "@/lib/api";
import { useAdminAuth } from "@/context/AdminAuthContext";

const AdminMessages = () => {
  const { token } = useAdminAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-submissions", token],
    queryFn: () => fetchContactSubmissions(token),
    enabled: !!token,
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => markContactAsRead(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      toast({ title: "Marked as read" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteContactSubmission(token, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-submissions"] });
      toast({ title: "Message deleted" });
    },
  });

  const unreadCount = messages?.filter((m) => !m.isRead).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm text-slate-400">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}` : "No new messages"}
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !messages?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-slate-400">
            <Mail className="h-12 w-12 mx-auto mb-4 text-slate-600" />
            <p>No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <Card key={msg.id} className={msg.isRead ? "opacity-75" : ""}>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-lg">{msg.name}</CardTitle>
                    {!msg.isRead && (
                      <Badge variant="default" className="bg-primary text-primary-foreground">
                        New
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1 text-slate-300">
                    <Mail className="h-3 w-3" />
                    <a href={`mailto:${msg.email}`} className="hover:underline text-primary">
                      {msg.email}
                    </a>
                  </div>
                  {msg.phone && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <Phone className="h-3 w-3" />
                      <span>{msg.phone}</span>
                    </div>
                  )}
                  {msg.company && (
                    <div className="flex items-center gap-1 text-slate-300">
                      <Building className="h-3 w-3" />
                      <span>{msg.company}</span>
                    </div>
                  )}
                </div>

                <div className="bg-slate-900/50 rounded-lg p-4">
                  <p className="text-sm text-slate-200 whitespace-pre-wrap">{msg.message}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  {!msg.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(msg.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-1 text-green-400" />
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate(msg.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
