import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { ShoppingCart } from "lucide-react"

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false })

  function getStatusBadge(status: string) {
    switch (status) {
      case "paid":
        return <Badge className="bg-chart-3/20 text-chart-3 border-chart-3/30">Lunas</Badge>
      case "pending":
        return <Badge variant="secondary">Menunggu</Badge>
      case "cancelled":
        return <Badge variant="destructive">Batal</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-serif font-semibold">Kelola Pesanan</h1>
        <p className="text-muted-foreground">Lihat dan kelola semua pesanan</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Daftar Pesanan</CardTitle>
          {/* <CardDescription>Total 0 pesanan</CardDescription> */}
          <CardDescription>Total {orders?.length || 0} pesanan</CardDescription>
        </CardHeader>
        <CardContent>
          {orders && orders.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pesanan</TableHead>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || "-"}</p>
                          <p className="text-xs text-muted-foreground">{order.profiles?.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{order.package_name}</TableCell>
                      <TableCell>Rp {order.amount?.toLocaleString("id-ID")}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString("id-ID")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada pesanan</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
