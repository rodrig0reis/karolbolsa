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
import { getStoreSettings } from '@/lib/settings'

const navLinks = [
  { name: 'Início', href: '/' },
  { name: 'Produtos', href: '/produtos' },
  { name: 'Bolsas', href: '/bolsas' },
  { name: 'Acessórios', href: '/categoria/acessorios' },
  { name: 'Promoções', href: '/promocoes' },
  { name: 'Sobre', href: '/sobre' },
  { name: 'Contato', href: '/contato' },
]

export async function Header() {
  const settings = await getStoreSettings()
  const storeName = settings?.storeName || "Karol Bolsas"
  const instagramUrl = settings?.instagramLink || "https://www.instagram.com/karolbolsas_artesanais/"

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
                <div className="h-px w-full bg-border my-2" />
                {instagramUrl && (
                  <Link
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-lg font-medium text-foreground/70 transition-colors hover:text-primary"
                  >
                    <InstagramIcon className="h-5 w-5" />
                    Instagram Oficial
                  </Link>
                )}
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
          {instagramUrl && (
            <Link href={instagramUrl} target="_blank" rel="noopener noreferrer" title="Instagram Oficial">
              <Button variant="ghost" size="icon" className="hidden sm:inline-flex text-muted-foreground hover:text-primary" aria-label="Acessar Instagram">
                <InstagramIcon className="h-5 w-5" />
              </Button>
            </Link>
          )}
          
          <form action="/produtos" className="relative flex items-center">
            <input 
              type="search" 
              name="q" 
              placeholder="Buscar..." 
              className="h-9 w-0 sm:w-48 sm:px-4 sm:border sm:border-input sm:rounded-full bg-transparent focus:w-48 focus:px-4 focus:border focus:border-input transition-all duration-300 outline-none placeholder:text-muted-foreground text-sm"
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0 text-muted-foreground hover:text-primary rounded-full sm:bg-transparent bg-background">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
