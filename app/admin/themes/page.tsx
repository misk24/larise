import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Palette, Plus } from "lucide-react"

export default async function AdminThemesPage() {
  const supabase = await createClient()

  const { data: themes } = await supabase.from("themes").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-2xl md:text-3xl font-medium">Kelola Tema</span>
          <p className="text-muted-foreground">Kelola tema undangan yang tersedia</p>
        </div>

        <Button>
          <Plus className="size-4" />
          Tambah Tema
        </Button>
      </div>

      <Card className="border-border bg-sidebar">
        <CardHeader>
          <CardTitle>Daftar Tema</CardTitle>
          <CardDescription>Total {themes?.length || 0} tema tersedia</CardDescription>
        </CardHeader>

        <CardContent>
          {themes && themes.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Tema</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {themes.map((theme) => (
                    <TableRow key={theme.id}>
                      <TableCell className="font-medium">{theme.name}</TableCell>
                      <TableCell>{theme.category}</TableCell>
                      <TableCell>
                        {theme.price ? `Rp ${theme.price.toLocaleString("id-ID")}` : "Gratis"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={theme.is_active ? "default" : "secondary"}>
                          {theme.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="size-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada tema</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
