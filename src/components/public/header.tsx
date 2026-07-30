import Link from 'next/link'
import { Search, Menu } from 'lucide-react'

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
)
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet'
import { prisma } from '@/lib/prisma'

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Bolsas', href: '/categoria/bolsas' },
  { name: 'Acessórios', href: '/categoria/acessorios' },
  { name: 'Promoções', href: '/promocoes' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
]

export async function Header() {
  const settings = await prisma.storeSettings.findFirst()
  const storeName = settings?.storeName || "Karol Bolsas"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        
        {/* Mobile Menu */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="mr-2" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="text-left font-serif text-2xl font-bold tracking-tight text-primary">
                  {storeName}
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-foreground/70 transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex items-center justify-center flex-1 md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold tracking-tight text-primary">
              {storeName}
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-primary text-foreground/70"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-1 justify-end">
          {settings?.instagramLink && (
            <Link href={settings.instagramLink} target="_blank">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-primary">
                <InstagramIcon className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Button>
            </Link>
          )}
          
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
            <Search className="h-5 w-5" />
            <span className="sr-only">Buscar</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
