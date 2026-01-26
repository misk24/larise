import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClient } from "@/lib/supabase/server"
import { Palette, Plus } from "lucide-react"

export default async function AdminTemplatesPage() {
  const supabase = await createClient()

  const { data: templates } = await supabase.from("templates").select("*").order("name")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="text-2xl md:text-3xl font-heading">Kelola Template</span>
          <p className="text-muted-foreground">Kelola template undangan yang tersedia</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Template
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Daftar Tema</CardTitle>
          {/* <CardDescription>Total 0 tema tersedia</CardDescription> */}
          <CardDescription>Total {templates?.length || 0} template tersedia</CardDescription>
        </CardHeader>
        <CardContent>
          {templates && templates.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama Template</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.category}</TableCell>
                      <TableCell>
                        {template.price ? `Rp ${template.price.toLocaleString("id-ID")}` : "Gratis"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={template.is_active ? "default" : "secondary"}>
                          {template.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada template</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
