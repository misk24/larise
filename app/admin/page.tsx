import RecentUsersTable from "@/components/admin/recent-users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { StatsCard } from "@/components/ui/stats-card";
import { createClient } from "@/lib/supabase/server";
import {
  FileTextIcon,
  ShoppingCartIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "user");

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
    .eq("role", "user")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total Pengguna",
      value: usersCount || 0,
      icon: UsersIcon,
      change: 3,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Undangan",
      value: invitationsCount || 0,
      icon: FileTextIcon,
      change: 1,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Total Pesanan",
      value: ordersCount || 0,
      icon: ShoppingCartIcon,
      change: 6,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Pendapatan",
      value: "Rp 0",
      icon: TrendingUpIcon,
      change: 4,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="dashboard">Dashboard</h2>
        <p className="text-muted-foreground">
          Selamat datang di panel administrasi LARISÉ
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 col-span-full">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            iconColor={stat.color}
            iconBg={stat.bgColor}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border bg-sidebar overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Pengguna Terbaru</CardTitle>
            <CardDescription>5 pengguna yang baru mendaftar</CardDescription>
          </CardHeader>

          <CardContent>
            {recentUsers && recentUsers.length > 0 ? (
              <RecentUsersTable data={recentUsers ?? []} />
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
