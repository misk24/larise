import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { FileText, ShoppingCart, TrendingUp, Users } from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: invitationsCount } = await supabase
    .from("invitations")
    .select("*", { count: "exact", head: true });

  const { count: ordersCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentUsers } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Pengguna",
      value: usersCount || 0,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Undangan",
      value: invitationsCount || 0,
      icon: FileText,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Total Pesanan",
      value: ordersCount || 0,
      icon: ShoppingCart,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Pendapatan",
      value: "Rp 0",
      icon: TrendingUp,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <span className="text-2xl md:text-3xl font-medium">Dashboard</span>
        <p className="text-muted-foreground">
          Selamat datang di panel administrasi LARISÉ
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border bg-sidebar">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`size-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-medium">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border bg-sidebar">
          <CardHeader>
            <CardTitle className="text-lg">Pengguna Terbaru</CardTitle>
            <CardDescription>5 pengguna yang baru mendaftar</CardDescription>
          </CardHeader>
          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {user.full_name || "Tanpa Nama"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Belum ada pengguna
              </p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border bg-sidebar">
          <CardHeader>
            <CardTitle className="text-lg">Pesanan Terbaru</CardTitle>
            <CardDescription>5 pesanan terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            {recentOrders && recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">
                        {order.profiles?.full_name || "Tanpa Nama"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.package_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        Rp {order.amount?.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Belum ada pesanan
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
