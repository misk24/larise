import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MailIcon } from 'lucide-react'

export default async function VerifyEmailPage() {
  return (
    <div className="flex min-h-screen bg-card items-center justify-center px-4">
      <Card className="w-full max-w-md border-none bg-primary-foreground text-center">
        <CardHeader className="space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <MailIcon className="size-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading tracking-wide">Verifikasi Email</CardTitle>
          <CardDescription>Kami sudah mengirim email verifikasi ke alamat email kamu.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Silakan cek inbox atau folder spam, lalu klik link verifikasi untuk mengaktifkan akun kamu.
          </p>

          <div className="space-y-2">
            <Button asChild className="w-full">
              <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">
                Buka Gmail
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
