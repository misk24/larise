import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { PaletteIcon } from "lucide-react";
import Link from "next/link";

export default async function AdminThemesPage() {
  const supabase = await createClient();

  const { data: themes } = await supabase
    .from("themes")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="backend-content space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Kelola Tema</h1>
          <p className="text-muted-foreground">
            Kelola tema undangan yang tersedia
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/themes/create" className="flex items-center gap-2">
            Buat Tema
          </Link>
        </Button>
      </div>
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle>Daftar Tema</CardTitle>
          <CardDescription>
            Total {themes?.length || 0} tema tersedia
          </CardDescription>
        </CardHeader>
        <CardContent>
          {themes && themes.length > 0 ? (
            <div className="backend-table-container">
              <Table>
                <TableHeader className="bg-muted/70">
                  <TableRow>
                    <TableHead className="text-foreground">
                      Nama Tema
                    </TableHead>
                    <TableHead className="text-foreground">
                      Kategori
                    </TableHead>
                    <TableHead className="text-foreground">
                      Harga
                    </TableHead>
                    <TableHead className="text-foreground">
                      Status
                    </TableHead>
                    <TableHead className="text-foreground">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {themes.map((theme) => (
                    <TableRow key={theme.id}>
                      <TableCell className="font-medium">
                        {theme.name}
                      </TableCell>
                      <TableCell>{theme.category}</TableCell>
                      <TableCell>
                        {theme.price
                          ? `Rp ${theme.price.toLocaleString("id-ID")}`
                          : "Gratis"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={theme.is_active ? "default" : "secondary"}
                        >
                          {theme.is_active ? "Aktif" : "Nonaktif"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/themes/${theme.id}`}>Edit</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-12 text-center">
              <PaletteIcon className="size-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">Belum ada tema</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
